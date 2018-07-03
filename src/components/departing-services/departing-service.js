import React from 'react';
import classnames from 'classnames';

import './departing-service.css';

const DepartingService = ({service: { scheduledTime, destination, operator, platform, realTimeUpdate}}) => {
  return (
    <li className="departing-service"
        data-test="service">
      <div className="departing-service-column">
        <div className="scheduled-time">
          {scheduledTime}
        </div>
      </div>
      <div className="departing-service-column">
        <span className="destination">
            {destination}
        </span>
        <div className="operator">
          {operator}
        </div>
      </div>
      <div className="departing-service-column">
        <div className="platform">
          Plat. {platform}
        </div>
        <div className={getStyle(realTimeUpdate)}>
          {getRealTimeText(realTimeUpdate)}
        </div>
      </div>
      <div className="departing-service-column">
        <i className="view-service"/>
      </div>
    </li>
  );
};

const getRealTimeText = (realTimeUpdate) => {
  const harcodedUpdates = ["On time", "Delayed"];
  return harcodedUpdates.includes(realTimeUpdate) ? realTimeUpdate : `Exp. ${realTimeUpdate}`;
};

const getStyle = (realTimeUpdate) => {
  classnames("real-time-update", {
    "onTime": realTimeUpdate === "On time",
    "delayed": realTimeUpdate !== "On time"
  })
};

export default DepartingService;