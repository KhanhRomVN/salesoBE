//* NPM Package
const express = require('express');
require('dotenv').config();
const cookiesParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');

//* CORS 
const cors = require('cors');
const whiteList = process.env.WHITE_LIST.split(',');

//* MongoDB
const { connectDB } = require('./config/mongoDB');

//* Socket IO
const http = require('http');
const socketIo = require('socket.io');
const socketHandler = require('./socket/index');

//* Endpoint API
const adminRoute = require('./routes/admin.route');
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const productRoute = require('./routes/product.route');
const reviewRoute = require('./routes/review.route')
const chatRoute = require('./routes/chat.route');
const cartRoute = require('./routes/cart.route');
const postRoute = require('./routes/post.route')
const notificationRoute = require('./routes/notification.route');
const commentRoute = require('./routes/comment.route')

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
const io = socketIo(server, { cors: { origin: process.env.FRONTEND_URL, credentials: true } });

app.use(express.static('public'));
app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookiesParser());

app.get('/', (req, res) => {
  res.json({
    message: "Server running at " + process.env.PORT
  });
});

app.use('/admin', adminRoute);
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/review', reviewRoute);
app.use('/cart', cartRoute);
app.use('/chat', chatRoute);
app.use('/notification', notificationRoute);
app.use('/post', postRoute);
app.use('/comment', commentRoute);

socketHandler(io);

const PORT = process.env.PORT || 8080;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
  });
});
