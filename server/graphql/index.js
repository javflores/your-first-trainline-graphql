const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');

const { departingServicesTypes, departingServicesResolvers } = require('./departing-services');

const router = express.Router();

const queryDefinitions = `
  type Query {
    departingServices(origin: String): [DepartingService]
    status: String
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
      departingServicesTypes
  ],
  resolvers
});

router.post('/', bodyParser.json(), graphqlExpress({ schema: graphQLSchema }));

module.exports = router;