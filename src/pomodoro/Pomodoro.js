import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import Break from "./Break";
import Focus from "./Focus";
import Session from "./Session";

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  let progress = prevState.progress;
  if (prevState.label === "Focusing"){
    progress = prevState.progress + .067;
  }
  else if (prevState.label === "On Break"){
    progress = prevState.progress + .32;
  }
  return {
    ...prevState,
    timeRemaining,
    progress
  };
}

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
        progress: 0
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
      progress: 0
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);

  // ToDo: Allow the user to adjust the focus and break duration.
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState("05");
  const [disable, setDisable] = useState(true);
  const [disableTime, setDisableTime] = useState(false);
  const [disableProgress, setDisableProgress] = useState(false);
  // const [progress, setProgress] = useState(0);

  const increaseFocusTime = () => {
    if (isTimerRunning === false && focusDuration <= 55){
      let New = focusDuration + 5;
      if (New < 10){
        New = "0" + New;
      }
      setFocusDuration((previousDuration) => New);
    }
  };
  const decreaseFocusTime = () => {
    if (isTimerRunning === false && focusDuration > 5){
      let New = focusDuration - 5;
      if (New < 10){
        New = "0" + New;
      }
      setFocusDuration((previousDuration) => New);
    }
  };
  const increaseBreaktime = () => {
    let Int = parseInt(breakDuration);
    if (isTimerRunning === false && Int <= 14){
      let New = Int + 1;
      if (New < 10){
        New = "0" + New;
      }
      let str = New.toString();
      setBreakDuration((previousDuration) => str);
    } 
  };
  const decreaseBreakTime = () => {
    let Int = parseInt(breakDuration);
    if(isTimerRunning === false && Int > 1){
      let New = Int - 1;
      if (New < 10){
        New = "0" + New;
      }
      let str = New.toString();
      setBreakDuration((previousDuration) => str);
    }
  };

  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will not need to make changes to the callback function
   */
  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setDisable((previous) => false);
    setDisableTime((previous) => true);
    setDisableProgress((previous) => true);
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
              progress: 0
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }
  function startStop(){
    if (disable !== true){
      setDisableProgress((previous) => false);
      setIsTimerRunning((previous) => false);
      session.timeRemaining = null;
      session.label = null;
      setDisable((previous) => true);
    }
    else {
      setDisableTime((previous) => false);
    }
  }

  return (
    <div className="pomodoro">
      <div>
        <Focus focusDuration={focusDuration} disableTime={disableTime} 
        increaseFocusTime={increaseFocusTime} decreaseFocusTime={decreaseFocusTime} />
        <Break breakDuration={breakDuration} disableTime={disableTime} 
        increaseBreaktime={increaseBreaktime} decreaseBreakTime={decreaseBreakTime} />
        <div/>
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            {/* TODO: Implement stopping the current focus or break session. and disable the stop button when there is no active session */}
            {/* TODO: Disable the stop button when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              onClick ={startStop}
              disabled={disable}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      <div>
        {/* TODO: This area should show only when there is an active focus or break - i.e. the session is running or is paused */}
        <Session session={session} breakDuration={breakDuration} 
        focusDuration={focusDuration} disableProgress={disableProgress} />
      </div>
    </div>
  );
}

export default Pomodoro;