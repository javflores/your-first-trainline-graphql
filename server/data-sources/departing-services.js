const { RESTDataSource } = require('apollo-datasource-rest');

class DepartingServices extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://realtime.thetrainline.com/';
  }
  
  async getDepartures() {
    return this.get('departures/wat');
  }
}

module.exports = DepartingServices;
