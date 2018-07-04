const client = require('superagent');
const stations = require('../../../stations.json');
const pubsub = require('../../graphql/pub-sub');

const ON_TIME = 'On time';
const DELAYED = 'Delayed';

const departingServicesTypes = `
  type DepartingService {
    origin: String
    destination: String
    operator: String
    scheduledTime: String
    platform: Int
    realTimeUpdate: String
  }
`;

const getDepartingServicesResolver = async ({origin = "WAT"}) => {
  const departuresEndpoint = `https://realtime.thetrainline.com/departures/${origin}`;
  const response = await client.get(departuresEndpoint);
  
  return response.body.services.map((service) => {
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

const readDestination = (service) => {
  return service.destinationList[0].crs;
};

const mapToFullName = (code) => {
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

const departingServicesResolvers = {
  Query: {
    departingServices: (root, args) => getDepartingServicesResolver(args)
  },
  Subscription: {
    servicesChanged: {
      subscribe: () => pubsub.asyncIterator('servicesChanged'),
    }
  }
};

module.exports = {
  departingServicesTypes,
  departingServicesResolvers
};