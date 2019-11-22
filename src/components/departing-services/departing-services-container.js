import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import DepartingServices from './departing-services';

const DepartingServicesContainer = ({data}) => {
  if(!data || !data.departingServices) return null;
  return <DepartingServices data={data} originChanged={() => {}}/>
};

const getDepartingServicesFrom = gql`
  query ($origin: String){
    departingServices(origin: $origin) {
      origin
      destination
      operator
      scheduledTime
      platform
      realTimeUpdate
    }
  }
`;

export default graphql(getDepartingServicesFrom, {
  options: () => ({
    variables: {
      origin: "WAT"
    }
  })
})(DepartingServicesContainer);
