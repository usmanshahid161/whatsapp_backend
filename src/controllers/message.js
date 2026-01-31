const whatsapp = require('../services/whatsapp');

exports.sendText = async (req, res) => {
  const { to, message } = req.body;
  await whatsapp.sendText(to, message);
  res.json({ success: true });
};

exports.sendMedia = async (req, res) => {
  const { to, mediaId, type } = req.body;
  await whatsapp.sendMedia(to, mediaId, type);
  res.json({ success: true });
};

exports.sendLocation = async (req, res) => {
  const { to, lat, lng, name } = req.body;
  await whatsapp.sendLocation(to, lat, lng, name);
  res.json({ success: true });
};

exports.sendContact = async (req, res) => {
  const { to, contact } = req.body;
  await whatsapp.sendContact(to, contact);
  res.json({ success: true });
};

exports.sendTemplate = async (req, res) => {
  const { to, template, lang } = req.body;
  await whatsapp.sendTemplate(to, template, lang);
  res.json({ success: true });
};
