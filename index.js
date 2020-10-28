
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
        client.join(9592491 /* <- Replace with code */, `${name}${id}`);
        client.on("Joined", () => {
            console.log("I joined the Kahoot!");
            client.on("questionStart", (question) => {
                question.answer(Math.floor(Math.random() * 4));
            });
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