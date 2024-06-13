const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/mongoDB');
const cookiesParser = require('cookie-parser');
const { app, server } = require('./socket/index');
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const productRoute = require('./routes/product.route')
const adminRoute = require('./routes/admin.route')
const chatRoute = require('./routes/chat.route')
const cartRoute = require('./routes/cart.route')
const whiteList = process.env.WHITE_LIST.split(',');

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

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookiesParser());

const PORT = process.env.PORT || 8080;

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

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("server running at " + PORT);
  });
});
