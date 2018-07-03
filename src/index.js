import React from 'react';
import ReactDOM from 'react-dom';
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import apolloClient from './apollo-client';

import DepartingServices from './components/departing-services/departing-services-container';

import './index.css';

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <Router>
    <Switch>
    <Route exact path="/" component={DepartingServices}/>
  </Switch >
  </Router>
  </ApolloProvider>,
document.getElementById('root'));