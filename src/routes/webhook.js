const router = require('express').Router();
const controller = require('../controllers/webhook');

router.get('/', controller.verifyWebhook);
router.post('/', controller.receiveMessage);

module.exports = router;
