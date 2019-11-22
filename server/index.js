const { ApolloServer, gql } = require('apollo-server');
const client = require('superagent');

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
    status: () => ({
      code: 200,
      message: "GraphQL status: OK"
    }),
    departingServices: () => getDepartingServicesResolver()
  }
};

const typeDefs = gql`
  type Status {
    code: Int
    message: String
  }
  
  type DepartingService {
    origin: String
    destination: String
    operator: String
  }
  
  type Query {
    status: Status
    departingServices: [DepartingService]
  }
`;

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
