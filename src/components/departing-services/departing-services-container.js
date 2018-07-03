import React from 'react';
import DepartingServices from './departing-services';

const DepartingServicesContainer = () => {
  return <DepartingServices data={getData()}/>
};

function getData(){
  return {
    departingServices: [{
      scheduledTime: "10:02",
      destination: "London",
      operator: "Southern",
      platform: 9,
      realTimeUpdate: "Delayed"
    },{
      scheduledTime: "10:10",
      destination: "Heathrow",
      operator: "Southern",
      platform: 10,
      realTimeUpdate: "On time"
    }]
  };
}

export default DepartingServicesContainer;