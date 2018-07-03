import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import DepartingServices from './departing-services';
import Spinner from '../loading';

const ORIGIN = "WAT";

const DepartingServicesContainer = ({data}) => {
  const {loading, departingServices} = data;
  if(loading) return <Spinner />;
  
  return <DepartingServices origin={ORIGIN}
                            departingServices={departingServices}
                            originChanged={() => {}}/>
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
      origin: ORIGIN
    }
  })
})(DepartingServicesContainer);