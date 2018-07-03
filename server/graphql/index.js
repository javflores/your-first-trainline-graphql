const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const router = express.Router();

const typeDefs = `
  type DepartingService {
    origin: String
    destination: String
  }
  
  type Query {
    status: String
    departingServices: [DepartingService]
  }
`;

const getDepartingServicesResolver = () => {
  return [{
    origin: "Euston",
    destination: "Birmingham",
  }, {
    origin: "Euston",
    destination: "Manchester"
  }];
};

const resolvers = {
  Query: {
    status: () => "GraphQL status: OK",
    departingServices: () => getDepartingServicesResolver()
  }
};

const graphQLSchema =  makeExecutableSchema({
  typeDefs,
  resolvers,
});

router.post('/', bodyParser.json(), graphqlExpress({ schema: graphQLSchema }));

module.exports = router;