const express = require('express');
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use('/webhook', require('./routes/webhook'));
app.use('/messages', require('./routes/message'));

module.exports = app;
