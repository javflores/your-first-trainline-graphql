import React from 'react';

import DepartingService from './departing-service';
import './departing-services.css';

const DepartingServices = ({data: {departingServices}}) =>
  <ul className="departing-services">
    {departingServices.map((service, index) => {
      return <DepartingService key={`service-${index}`}
                               service={service}/>
    }, this)}
  </ul>;
  
  

export default DepartingServices;