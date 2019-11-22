const { ApolloServer, gql } = require('apollo-server');

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
