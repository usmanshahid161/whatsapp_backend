const axios = require('axios');

module.exports = axios.create({
  baseURL: 'https://graph.facebook.com/v19.0',
  headers: {
    Authorization: `Bearer ${process.env.META_TOKEN}`,
    'Content-Type': 'application/json'
  }
});
