const path= require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5cc58a67c9d61374bcff6967')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
   .connect(
      'mongodb+srv://Vjacheslav:zxcv1234@cluster0-e2moq.mongodb.net/shop?retryWrites=true'
   )
   .then(() => {
      User.findOne().then(user => {
         if (!user) {
            const user = new User({
               name: 'Slavik',
               email: 'slavikov.net@gmail.com',
               cart: {
                  items: [],
               }
            });
            user.save();
         }
      });
      app.listen(3000)
   })
   .catch(err => console.log(err));
