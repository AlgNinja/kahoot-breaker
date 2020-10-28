
const http = require('http'), 
https = require('https'), 
express = require('express'),
bp = require('body-parser'),
pug = require('pug'),
Kahoot = require('kahoot.js-updated'),
app = express();

const server = http.createServer(app).listen(process.env.PORT || 80);
const io = require('socket.io')(server);

app.use(bp.json());
app.use(bp.urlencoded({
  extended: true
}));

app.set('view engine', 'pug');
app.set('views', './');



function spawn(pin, name, amt) {
    var id = 0;
    for(var i = 0; i <=amt; i++) {
        const client = new Kahoot();
        id = id + 1;
        client.join(pin, `${name}${id}`);
        client.on("Joined", () => {
            console.log("yay!");
        });
    }
}

io.on('connection', (socket) => {
    socket.on('spawn', (dataString) => {
      let data = JSON.parse(dataString);
  
      var pin = parseFloat(data.pin)
      , name = data.name
      , amt = parseInt(data.amt);
  
      spawn(pin, name, amt);
    });
  
    socket.on('join', room => {
      socket.join(room);
    })
  });
  
  app.get('/', (req, res) => {
    res.render('index');
  });
