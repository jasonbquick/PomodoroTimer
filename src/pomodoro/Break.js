import React from "react"

function Break({ breakDuration, disableTime, decreaseBreakTime, increaseBreaktime }) {
    return (
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
  )
}

export default Break