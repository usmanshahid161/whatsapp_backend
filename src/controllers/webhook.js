exports.verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};

exports.receiveMessage = (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;

  const message = value?.messages?.[0];
  if (!message) return res.sendStatus(200);

  console.log('Incoming Message:', message.type, message);

  // handle by type
  switch (message.type) {
    case 'text':
      break;
    case 'image':
    case 'video':
    case 'audio':
    case 'document':
      break;
    case 'location':
      break;
    case 'contacts':
      break;
    case 'interactive':
      break;
  }

  res.sendStatus(200);
};
