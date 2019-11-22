const { ApolloServer, gql } = require('apollo-server');
const DepartingServices = require( "./data-sources/departing-services");

const stations = require('../stations.json');
const ON_TIME = 'On time';
const DELAYED = 'Delayed';

const getDepartingServicesResolver = async ({origin = "WAT"}, dataSources) => {
  const departures = await dataSources.departingServices.getDepartures(origin);
  return departures.services.map((service) => {
    return {
      origin: mapToFullName(origin),
      destination: mapToFullName(readDestination(service)),
      operator: service.serviceOperator,
      scheduledTime: readScheduledTime(service),
      platform: readPlatform(service),
      realTimeUpdate: produceRealTimeUpdate(service)
    };
  });
};

function readDestination(service){
  return service.destinationList[0].crs;
}

function mapToFullName(code){
  return stations.stations.find(x => x.crs === code).name;
}

const readScheduledTime = (service) => {
  const scheduledTime = new Date(service.scheduledInfo.scheduledTime);
  return toHoursAndMinutes(scheduledTime);
}

function containsRealTimePlatform(service){
  return service.realTimeUpdatesInfo && service.realTimeUpdatesInfo.realTimeServiceInfo && service.realTimeUpdatesInfo.realTimeServiceInfo.realTimePlatform;
}

function produceRealTimeUpdate(service) {
  if(!service.realTimeUpdatesInfo){
    return ON_TIME;
  }
  
  const delayReason = service.realTimeUpdatesInfo.delayReason;
  if(delayReason) {
    return DELAYED;
  }
  
  if(!service.realTimeUpdatesInfo.realTimeServiceInfo){
    return ON_TIME;
  }
  
  const realTime = new Date(service.realTimeUpdatesInfo.realTimeServiceInfo.realTime);
  const scheduleTime = new Date(service.scheduledInfo.scheduledTime);
  return realTime > scheduleTime ? toHoursAndMinutes(realTime) : ON_TIME;
}

function toHoursAndMinutes(date){
  return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function readPlatform(service){
  if(containsRealTimePlatform(service)){
    return Number(service.realTimeUpdatesInfo.realTimeServiceInfo.realTimePlatform);
  }
  
  return Number(service.scheduledInfo.scheduledPlatform);
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
    scheduledTime: String
    platform: Int
    realTimeUpdate: String
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
