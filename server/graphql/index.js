const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const client = require('superagent');

const router = express.Router();

const typeDefs = `
  type DepartingService {
    origin: String
    destination: String
    operator: String
  }
  
  type Query {
    status: String
    departingServices: [DepartingService]
  }
`;

const getDepartingServicesResolver = async () => {
  
  const departuresEndpoint = `https://realtime.thetrainline.com/departures/wat`;
  const response = await client.get(departuresEndpoint);
  
  return response.body.services.map((service) => {
    return {
      origin: 'WAT',
      destination: readDestination(service),
      operator: service.serviceOperator
    };
  });
};

function readDestination(service){
  return service.destinationList[0].crs;
}

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