const axios = require('../utils/axios');

const phoneId = process.env.PHONE_NUMBER_ID;

exports.sendText = (to, text) =>
  axios.post(`/${phoneId}/messages`, {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: text }
  });

exports.sendMedia = (to, mediaId, type) =>
  axios.post(`/${phoneId}/messages`, {
    messaging_product: 'whatsapp',
    to,
    type,
    [type]: { id: mediaId }
  });

exports.sendLocation = (to, lat, lng, name) =>
  axios.post(`/${phoneId}/messages`, {
    messaging_product: 'whatsapp',
    to,
    type: 'location',
    location: { latitude: lat, longitude: lng, name }
  });

exports.sendContact = (to, contact) =>
  axios.post(`/${phoneId}/messages`, {
    messaging_product: 'whatsapp',
    to,
    type: 'contacts',
    contacts: [contact]
  });

exports.sendTemplate = (to, name, lang) =>
  axios.post(`/${phoneId}/messages`, {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name,
      language: { code: lang }
    }
  });
