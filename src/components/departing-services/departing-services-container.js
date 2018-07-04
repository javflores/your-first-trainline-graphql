import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {compose, withStateHandlers, lifecycle} from "recompose";

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

const departingServicesSubscription = gql`
  subscription onServicesChanged($origin: String) {
    servicesChanged(origin: $origin) {
      origin
      destination
      operator
      scheduledTime
      platform
      realTimeUpdate
    }
  }
`;

const subscribeToNewServices = ({data}) => {
  data.subscribeToMore({
    document: departingServicesSubscription,
    variables: { origin: data.variables.origin },
    updateQuery: (previous, { subscriptionData }) => {
      return {
        departingServices: subscriptionData.data.servicesChanged
      };
    },
  })
};

const enhance = compose(
  withStateHandlers({
    origin: INITIAL_ORIGIN,
    destination: "London"
  }, {
    originChanged: () => (origin) => ({origin}),
  }),
  graphql(getDepartingServicesFrom, {
    options: ({origin}) => ({
      variables: {
        origin
      }
    })
  }),
  lifecycle({
    componentDidMount() {
      subscribeToNewServices(this.props);
    },
  }),
);

export default enhance(DepartingServicesContainer);