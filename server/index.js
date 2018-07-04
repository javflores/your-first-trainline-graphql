const express = require('express');
const { graphiqlExpress } = require('apollo-server-express');
const cors = require('cors');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const {graphql, graphQLSchema} = require('./graphql');

const PORT = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use('/graphql', graphql);
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
}));


app.get('/status', (req, res) => res.send('Express status: OK'));

const webSocket = createServer(app);

webSocket.listen(PORT, () => {
  console.log(`Apollo Server is now running on http://localhost:${PORT}`);
  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema: graphQLSchema
  }, {
    server: webSocket,
    path: '/subscriptions',
  });
});