const { ApolloServer, gql } = require('apollo-server');
const DepartingServices = require( "./data-sources/departing-services");

const getDepartingServicesResolver = async (dataSources) => {
  const departures = await dataSources.departingServices.getDepartures();
  return departures.services.map((service) => {
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
    departingServices: async (_source, _args, { dataSources }) => getDepartingServicesResolver(dataSources)
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      departingServices: new DepartingServices()
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
