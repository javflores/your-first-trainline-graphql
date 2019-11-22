const { ApolloServer, gql } = require('apollo-server');

const resolvers = {
  Query: {
    status: () => ({
      code: 200,
      message: "GraphQL status: OK"
    })
  }
};

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Status" type defines the queryable fields of the status of an api.
  type Status {
    code: Int
    message: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "status" query returns Status (defined above).
  type Query {
    status: Status
  }
`;

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
