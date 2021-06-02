import React from "react";

function Session ({ breakDuration, focusDuration, session, disableProgress }) {
    if (disableProgress === true) {
    return (
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
        </div>
    )}
    else {
        return null
    }
}
export default Session