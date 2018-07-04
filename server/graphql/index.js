const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');

const { departingServicesTypes, departingServicesResolvers } = require('./departing-services');

const graphql = express.Router();

const queryDefinitions = `
  type Query {
    departingServices(origin: String): [DepartingService]
    status: String
  }
`;

const subscriptionDefinitions = `
  type Subscription {
    servicesChanged(origin: String): [DepartingService]
  }
`;

const statusResolver = {
  Query: {
    status: () => "GraphQL status: OK",
  }
};
const resolvers = merge(statusResolver, departingServicesResolvers);

const graphQLSchema =  makeExecutableSchema({
  typeDefs: [
    queryDefinitions,
    subscriptionDefinitions,
    departingServicesTypes
  ],
  resolvers
});

graphql.post('/', bodyParser.json(), graphqlExpress({ schema: graphQLSchema }));

module.exports = {
  graphql,
  graphQLSchema
};