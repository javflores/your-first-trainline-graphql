const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const router = express.Router();

const typeDefs = `
  type Query {
    status: String
  }
`;

const resolvers = {
  Query: {
    status: () => "GraphQL status: OK"
  }
};

const graphQLSchema =  makeExecutableSchema({
  typeDefs,
  resolvers,
});

router.post('/', bodyParser.json(), graphqlExpress({ schema: graphQLSchema }));

module.exports = router;