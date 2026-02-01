const axios = require('axios');
const res = require('express/lib/response');
exports.createNewInteraction = (dbMessage, text) => {
  //add queue work
  //add campaign work
  //add customer work
  return axios.post(`${process.env.INT_MANAGER_URL}/interactions/create`).then(async response=>{
    let dbInteraction = response?.interaction;
    dbMessage.interactionId = dbInteraction._id;
    return axios.post(`${process.env.INT_MANAGER_URL}/messages/create`, {dbMessage}).then(async responseMessage=>{
      return { interaction: dbInteraction, message: responseMessage.data.message }
    }).catch(err=> res.status(500).send(err?.message));
  }
  )
}