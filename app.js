const path= require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User.findById('5cc469064602412f14aec4da')
//         .then(user => {
//             const { name, email, cart, _id } = user;
//             req.user = new User(name, email, cart, _id);
//             next();
//         })
//         .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
   .connect(
      'mongodb+srv://Vjacheslav:zxcv1234@cluster0-e2moq.mongodb.net/shop?retryWrites=true'
   )
   .then(() => {
      app.listen(3000)
   })
   .catch(err => console.log(err));
