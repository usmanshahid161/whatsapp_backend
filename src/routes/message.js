const router = require('express').Router();
const controller = require('../controllers/message');

router.post('/text', controller.sendText);
router.post('/media', controller.sendMedia);
router.post('/location', controller.sendLocation);
router.post('/contact', controller.sendContact);
router.post('/template', controller.sendTemplate);

module.exports = router;
