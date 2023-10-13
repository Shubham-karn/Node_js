var GoogleStrategy = require('passport-google-oauth20').Strategy;
const log = console.log;
const redis = require('redis');
const passport = require('passport');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./db/connectdb');
connectDB();
//routes import
const routes = require('./route/index');
require('./middleware/googleAuth');
//create an express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static('public'));
app.use('/static', express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

//initialize passport
app.use(passport.initialize());

// cors allowlist
const allowlist = [
  'http://localhost:5000',
  'http://localhost:5500',
  'https://localhost:3000',
];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
      origin: req.header('Origin'),
      methods: ['GET', 'POST'],
      credentials: true,
      sameSite: 'none',
    };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

//create http server
const http = require('http').createServer(app);

//create socket.io instance
const io = require('socket.io')(http, { cors: { origin: '*' } });

//define port for backend server
const port = 5000;
http.listen(port, () => log(`server listening on port: ${port}`));

//create redis client
let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on('error', (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

io.on('connection', async (socket) => {
  log('connected');

  socket.on('message', async (evt) => {
    socket.broadcast.emit('message', evt);
    await redisClient.set(Object.keys(evt)[0], Object.values(evt)[0]);
  });
});

io.on('disconnect', (evt) => {
  log('some people left');
});

app.use('/', cors(), routes);
