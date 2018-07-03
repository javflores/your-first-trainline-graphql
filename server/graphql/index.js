const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const { departingServicesTypes, departingServicesResolvers } = require('./departing-services');

const router = express.Router();

const queryDefinitions = `
  type Query {
    departingServices: [DepartingService]
    status: String
  }
`;

const statusResolver = {
  Query: {
    status: () => "GraphQL status: OK",
  }
};
const resolvers = {...statusResolver, ...departingServicesResolvers};

const graphQLSchema =  makeExecutableSchema({
  typeDefs: [
      queryDefinitions,
      departingServicesTypes
  ],
  resolvers
});

router.post('/', bodyParser.json(), graphqlExpress({ schema: graphQLSchema }));

module.exports = router;