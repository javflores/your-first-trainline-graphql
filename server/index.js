const { ApolloServer, gql } = require('apollo-server');
const DepartingServices = require( "./data-sources/departing-services");

const stations = require('../stations.json');

const getDepartingServicesResolver = async ({origin = "WAT"}, dataSources) => {
  const departures = await dataSources.departingServices.getDepartures(origin);
  return departures.services.map((service) => {
    return {
      origin: mapToFullName(origin),
      destination: mapToFullName(readDestination(service)),
      operator: service.serviceOperator
    };
  });
};

function readDestination(service){
  return service.destinationList[0].crs;
}

function mapToFullName(code){
  return stations.stations.find(x => x.crs === code).name;
}

const resolvers = {
  Query: {
    status: () => ({
      code: 200,
      message: "GraphQL status: OK"
    }),
    departingServices: async (_source, args, { dataSources }) => getDepartingServicesResolver(args, dataSources)
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
    departingServices(origin: String): [DepartingService]
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
