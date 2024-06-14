const express = require('express');
require('dotenv').config();
const cookiesParser = require('cookie-parser');
/* Cors */
const cors = require('cors');
const whiteList = process.env.WHITE_LIST.split(',');
/* MongoDN */
const { connectDB } = require('./config/mongoDB');
/* Socket IO */
const http = require('http');
const socketIo = require('socket.io');
const socketHandler = require('./socket/index');
/* Endpoint API  */
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const productRoute = require('./routes/product.route')
const adminRoute = require('./routes/admin.route')
const chatRoute = require('./routes/chat.route')
const cartRoute = require('./routes/cart.route')

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: process.env.FRONTEND_URL, credentials: true }});

app.use(express.static('public'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookiesParser());

app.get('/', (req, res) => {
  res.json({
    message: "Server running at " + PORT
  });
});
app.use('/auth', authRoute);
app.use('/product', productRoute);
app.use('/user', userRoute);
app.use('/admin', adminRoute);
app.use('/chat', chatRoute);
app.use('/cart', cartRoute);

socketHandler(io);

const PORT = process.env.PORT || 8080;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
  });
});