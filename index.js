var GoogleStrategy = require('passport-google-oauth20').Strategy;
const log = console.log;
const redis = require('redis');
const passport = require('passport');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const ACTIONS = require('./config/Actions');
dotenv.config();
const connectDB = require('./db/connectdb');
connectDB();
//routes import
const routes = require('./route/index');
require('./config/passportSetup');

//create an express app
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    },
  })
);
app.use(express.static('public'));
app.use('/static', express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());
// cors allowlist
const allowlist = [
  'http://localhost:5000',
  'http://localhost:5500',
  'http://localhost:3000',
];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
      SameSite: 'none',
    };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};
app.use('/', cors(corsOptionsDelegate), routes);

//create http server
const http = require('http').createServer(app);

//create socket.io instance
const server = require('http').createServer(app);
const io = require('socket.io')(server, cors(corsOptionsDelegate));

//define port for backend server
const port = 5000;

//create redis client
let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on('error', (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

// io.on('connection', async (socket) => {
//   log('connected');

//   socket.on('message', async (evt) => {
//     console.log(evt, 'scoketttttttttt')
//     // socket.broadcast.emit('message', evt);
//     // await redisClient.set(Object.keys(evt)[0], Object.values(evt)[0]);
//   });
// });

const userSocketMap = {};

function getAllConnectedClients(project_id) {
  return Array.from(io.sockets.adapter.rooms.get(project_id) || []).map(
    (socketId) => {
      const user = userSocketMap[socketId];
      return {
        socketId,
        username: user ? user.name : null,
        user_id: user ? user.user_id : null,
        thumbnail: user ? user.thumbnail : null,
      };
    }
  );
}

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on(ACTIONS.JOIN, async ({ project_id, name, user_id, thumbnail }) => {
    // Store user data in the userSocketMap
    userSocketMap[socket.id] = {
      name,
      user_id,
      thumbnail,
    };

    socket.join(project_id);
    const clients = getAllConnectedClients(project_id);
    console.log(clients, 'clients');
    clients
      // .filter(({ socketId }) => socketId !== socket.id)
      // .filter(({ user_id }) => user_id !== user_id)
      .forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
          clients: clients,
          name: name,
          socketId: socketId,
          user_id: user_id,
        });
      });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ project_id, code }) => {
    // console.log(project_id, code, 'code');
    socket.in(project_id).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    // console.log(code, 'sync code');
    // console.log(socketId, 'socketId');
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms
      .filter((room) => room !== socket.id)
      .forEach((project_id) => {
        socket.in(project_id).emit(ACTIONS.DISCONNECTED, {
          socketId: socket.id,
          userData: userSocketMap[socket.id],
        });
      });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
