const express = require('express');

const PORT = process.env.PORT || 9000;
const app = express();

app.get('/status', (req, res) => res.send('Express status: OK'));
console.log(`Express running on ${PORT}`);

app.listen(PORT);