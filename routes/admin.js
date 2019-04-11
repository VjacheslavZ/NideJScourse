const path = require('path');
//console.log(path)
const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
   res.render('add-product', {docTitle: 'Add product'})
});

router.post('/add-product', (req, res, next) => {
   products.push({title: req.body.title});
   res.redirect('/');
});

exports.routes = router;
exports.products = products;
