import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {compose, withStateHandlers} from "recompose";

import DepartingServices from './departing-services';
import Spinner from '../loading';

const INITIAL_ORIGIN = "WAT";

const DepartingServicesContainer = ({data, origin, originChanged}) => {
  const {loading, departingServices} = data;
  if(loading) return <Spinner />;
  
  return <DepartingServices origin={origin}
                            departingServices={departingServices}
                            originChanged={originChanged}/>
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

const enhance = compose(
  withStateHandlers({
    origin: INITIAL_ORIGIN
  }, {
    originChanged: () => (origin) => ({origin})
  }),
  graphql(getDepartingServicesFrom, {
    options: ({origin}) => ({
      variables: {
        origin
      }
    })
  }),
);

export default enhance(DepartingServicesContainer);