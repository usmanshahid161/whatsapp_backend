require('dotenv').config();
const app = require('./src/app');

app.listen(process.env.PORT, () => {
  console.log(`WhatsApp API running on port ${process.env.PORT}`);
});
