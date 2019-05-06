const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
   auth: {
      api_key: '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', //TODO add second part of api key
   }
}));

exports.getLogin = (req, res, next) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }

   res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: message,
      oldInput: {
         email: '',
         password: '',
      },
      validationErrors: [],
   });
};

exports.getSignup = (req, res, next) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }
   res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message,
      oldInput: { email: '', password: '', confirmPassword: '' },
      validationErrors: [],
   });
};

exports.postLogout = (req, res, next) => {
   req.session.destroy((err) => {
      console.log(err);
      res.redirect('/');
   });
};

exports.postSignup = (req, res, next) => {
   const { email, password, confirmPassword } = req.body;
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).render('auth/signup', {
         path: '/signup',
         pageTitle: 'Signup',
         errorMessage: errors.array()[0].msg,
         oldInput: { email, password, confirmPassword },
         validationErrors: errors.array(),
      });
   }

   bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
         const user = new User({
            email,
            password: hashedPassword,
            cart: {
               items: [],
            }
         });
         return user.save();
      })
      .then(result => {
         res.redirect('/login');
         return transporter.sendMail({
            to: email,
            from: "shop@node-complite.com",
            subject: 'SignUp succeeded',
            html: '<h1>You successfully signed up!</h1>'
         })
      })
      .catch(err => console.log(err))
};

exports.postLogin = (req, res, next) => {
   const { email, password } = req.body;
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
         path: '/login',
         pageTitle: 'Login',
         errorMessage: errors.array()[0].msg,
         oldInput: { email, password },
         validationErrors: errors.array(),
      })
   }

   User.findOne({ email: email })
      .then(user => {
         if (!user) {
            return res.status(422).render('auth/login', {
               path: '/login',
               pageTitle: 'Login',
               errorMessage: 'Invalid email or password.',
               oldInput: { email, password },
               validationErrors: [],
            })
         }
         bcrypt.compare(password, user.password)
            .then(doMatch => {
               if (doMatch) {
                  req.session.isLoggedIn = true;
                  req.session.user = user;
                  return req.session.save(err => {
                     console.log(err);
                     return res.redirect('/')
                  });
               }

               return res.status(422).render('auth/login', {
                  path: '/login',
                  pageTitle: 'Login',
                  errorMessage: 'Invalid email or password.',
                  oldInput: { email, password },
                  validationErrors: [],
               })
            })
            .catch(err => {
               console.log(err);
               return res.redirect('/login')
            })
      })
      .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
   req.session.destroy(err => {
      console.log(err);
      res.redirect('/');
   });
};

exports.getReset = (req, res, next) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }

   res.render('auth/reset', {
      path: '/reset',
      pageTitle: 'Reset password',
      errorMessage: message,
   })
};

exports.postReset = (req, res, next) => {
   crypto.randomBytes(32, (err, buffer) => {
      if (err) {
         console.log(err);
         return res.redirect('/reset');
      }
      const token = buffer.toString('hex');
      User
         .findOne({email: req.body.email})
         .then(user => {
            if (!user) {
               req.flash('error', 'No account with that email found.');
               return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return  user.save();
         })
         .then(result => {
            res.redirect('/');
            return transporter.sendMail({
               to: req.body.email,
               from: "shop@node-complite.com",
               subject: 'Password reset',
               html: `
                  <p>You requested a password reset</p>
                  <p>
                    Click this
                    <a href="http://localhost:3000/reset/${token}">Link</a>
                    to set a new password.
                  </p>
               `
            })
         })
         .catch(err => console.log(err))
   });
};

exports.getNewPassword = (req, res, next) => {
   const  token = req.params.token;
   User
      .findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() }})
      .then(user => {
         let message = req.flash('error');
         if (message.length > 0) {
            message = message[0];
         } else {
            message = null;
         }

         res.render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'New password',
            errorMessage: message,
            userId: user._id.toString(),
            passwordToken: token,
         })
      })
      .catch(err => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
   const newPassword = req.body.password;
   const userID = req.body.userId;
   const passwordToken = req.body.passwordToken;
   let resetUser;

   User
      .findOne({
         resetToken: passwordToken,
         resetTokenExpiration: { $gt: Date.now() },
         _id: userID
      })
      .then(user => {
         resetUser = user;
         return bcrypt.hash(newPassword, 12);
      })
      .then(hashedPassword => {
         resetUser.password = hashedPassword;
         resetUser.resetToken = undefined;
         resetUser.resetTokenExpiration = undefined;
         return resetUser.save();
      })
      .then(result => {
         res.redirect('/login');
      })
      .catch(err => console.log(err))
};
