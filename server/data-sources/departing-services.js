const { RESTDataSource } = require('apollo-datasource-rest');

class DepartingServices extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://realtime.thetrainline.com/';
  }
  
  async getDepartures(origin) {
    return this.get(`departures/${origin}`);
  }
}

module.exports = DepartingServices;
