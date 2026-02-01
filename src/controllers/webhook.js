const moment = require('moment');
const helper = require('../helper/herlper');
const axios = require('axios');
const { createNewInteraction } = require('../helper/herlper');
const res = require('express/lib/response');

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
  const datetime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  let waMessage = {}
  const caller = {
    id: value.contacts[0]?.wa_id,
    name: value?.contacts[0]?.profile?.name
  }

  const [date, time] = datetime.split(' ');
  const [year, month, day] = date.split('-');
  const [hrs, min, secs] = time.split(':');

  waMessage = {
    author: {
      id: caller?.id,
      name: caller?.name,
      role: "customer"
    },
    direction: 0,
    channel: "whatsapp",
    createdAt: datetime
  }

  // console.log('Incoming Message:', message.type, message);

  // handle by type
  switch (message.type) {
    case 'text':
      waMessage = {
        ...waMessage,
        messageType: "text",
        message: message?.text?.body,
      }
      break;
    case 'image':
    case 'video':
    case 'audio':
    case 'document':
      break;
    case 'button':
      waMessage = {
        ...waMessage,
        messageType: 'text',
        message: message?.button?.text
      }
      break;
    case 'location':
      waMessage = {
        ...waMessage,
        message: null,
        messageType: 'multimedia',
        attachments: [{
          type: 'location',
          data: {
            title: null,
            url: null,
            latitude: message.location.latitude || null,
            longitude: message.location.longitude || null
          }
        }]
      }
      break;
    case 'contacts':
      waMessage = {
        ...waMessage,
        message: null,
        messageType: 'multimedia',
        attachments: [{
          type: 'contacts',
          data: { contacts: message.contacts }
        }]
      }
      break;
    case 'interactive':
      if (message?.interactive?.type === 'call_permission_reply')
        return
      if (message?.interactive?.button_reply?.id?.includes('feedback')) {
        console.log('This is a feedback response!!!!!!!!')
        let arr = message?.interactive.button_reply.id.split(':');
        // let feedbackResponse = await findFeedback(arr[3]);

        let apiData = {
          interactionId: arr[1],
          type: 'default',
          author: caller?.id,
          authorType: 'customer',
          value: arr[2],
          appId: arr[3],
          // appName: feedbackResponse?.name ? feedbackResponse.name : null,
          input: message?.interactive?.button_reply?.title
        }
      }
      else {
        waMessage = {
          ...waMessage,
          messageType: 'interactive',
          message: JSON.stringify(message.interactive)
        }
      }
      break;
  }

  return axios.get(`${ process.env.INT_MANAGER_URL }/interactions/find`, {
    params: {
      "caller.id": caller.id,
      extension: "",
      channel: "whatsapp"
    }
  }).then(async response => {
    let interaction = response?.interaction
    if (!interaction) {
      await createNewInteraction(waMessage)
    }

    waMessage.interactionId = response?.interaction?._id;
    return axios.post(`${ process.env.INT_MANAGER_URL }/messages/create`, { waMessage }).then(async responseMessage => {
      return { message: responseMessage.data.message }
    }).catch(err => res.status(500).send(err?.message));

  }).catch(err => {
    console.log(err)
  })
};
