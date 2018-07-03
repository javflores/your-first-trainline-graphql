const express = require('express');
const { graphiqlExpress } = require('apollo-server-express');
const cors = require('cors');

const graphql = require('./graphql');

const PORT = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use('/graphql', graphql);
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));


app.get('/status', (req, res) => res.send('Express status: OK'));
console.log(`Express running on ${PORT}`);

app.listen(PORT);