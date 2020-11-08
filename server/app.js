const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(4000, () => {
  console.log('express server is running on 4000 port');
});
