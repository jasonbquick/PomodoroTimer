import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";

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
      setFocusDuration(New);
    }
  };
  const decreaseFocusTime = () => {
    if (isTimerRunning === false && focusDuration > 5){
      let New = focusDuration - 5;
      if (New < 10){
        New = "0" + New;
      }
      setFocusDuration(New);
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
      setBreakDuration(str);
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
      setBreakDuration(str);
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
    setDisable(false);
    setDisableTime(true);
    setDisableProgress(true);
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
      setDisableProgress(false);
      setIsTimerRunning(false);
      session.timeRemaining = null;
      session.label = null;
      setDisable(true);
    }
    else {
      setDisableTime(false);
    }
  }

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              {/* TODO: Update this text to display the current focus session duration */}
              Focus Duration: {focusDuration}:00
            </span>
            <div className="input-group-append">
              {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick = {decreaseFocusTime}
                disabled={disableTime}
              >
                <span className="oi oi-minus" />
              </button>
              {/* TODO: Implement increasing focus duration  and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick = {increaseFocusTime}
                disabled={disableTime}
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/* TODO: Update this text to display the current break session duration */}
                Break Duration: {breakDuration}:00
              </span>
              <div className="input-group-append">
                {/* TODO: Implement decreasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick = {decreaseBreakTime}
                  disabled={disableTime}
                >
                  <span className="oi oi-minus" />
                </button>
                {/* TODO: Implement increasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick = {increaseBreaktime}
                  disabled={disableTime}
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
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
        {disableProgress ? 
        <div>
        <div className="row mb-2">
          <div className="col">
            {/* TODO: Update message below to include current session (Focusing or On Break) total duration */}
            {session.label === "On Break" ? 
            <h2 data-testid="session-title">
              {session?.label} for {breakDuration}:00 minutes
            </h2> : 
            <h2 data-testid="session-title">
            {session?.label} for {focusDuration}:00 minutes
          </h2> }
            {/* TODO: Update message below correctly format the time remaining in the current session */}
            <p className="lead" data-testid="session-sub-title">
              {new Date(session.timeRemaining * 1000).toISOString().substr(11, 8)} remaining
            </p> 
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="0"
                aria-valuenow={session.progress} // TODO: Increase aria-valuenow as elapsed time increases
                style={{ width: session.progress + '%' }} // TODO: Increase width % as elapsed time increases
              />
            </div>
          </div>
        </div>
        </div> : null}
      </div>
    </div>
  );
}

export default Pomodoro;