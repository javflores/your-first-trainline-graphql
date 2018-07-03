const client = require('superagent');
const stations = require('../../../stations.json');

const departingServicesTypes = `
  type DepartingService {
    origin: String
    destination: String
    operator: String
  }
`;

const getDepartingServicesResolver = async ({origin = "WAT"}) => {
  const departuresEndpoint = `https://realtime.thetrainline.com/departures/${origin}`;
  const response = await client.get(departuresEndpoint);
  
  return response.body.services.map((service) => {
    return {
      origin: mapToFullName(origin),
      destination: mapToFullName(readDestination(service)),
      operator: service.serviceOperator
    };
  });
};

const readDestination = (service) => {
  return service.destinationList[0].crs;
};

function mapToFullName(code){
  return stations.stations.find(x => x.crs === code).name;
}

const departingServicesResolvers = {
  Query: {
    departingServices: (root, args) => getDepartingServicesResolver(args)
  }
};

module.exports = {
  departingServicesTypes,
  departingServicesResolvers
};