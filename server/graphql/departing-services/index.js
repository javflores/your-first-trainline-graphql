const client = require('superagent');

const departingServicesTypes = `
  type DepartingService {
    origin: String
    destination: String
    operator: String
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

const readDestination = (service) => {
  return service.destinationList[0].crs;
};

const departingServicesResolvers = {
  Query: {
    departingServices: () => getDepartingServicesResolver()
  }
};

module.exports = {
  departingServicesTypes,
  departingServicesResolvers
};