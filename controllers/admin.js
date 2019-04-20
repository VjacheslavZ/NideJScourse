const Product = require('../models/product');

exports.getAddProduct =  (req, res, next) => {
   res.render('admin/editProduct', {
      pageTitle: 'Add product',
      path: '/admin/add-product',
      editing: false,
   })
};

exports.postAddProduct = (req, res, next) => {
   const { title, imageUrl, price, description } = req.body;
   req.user.createProduct({
       title,
       price,
       imageUrl,
       description,
   })
  .then(result => {
     console.log('Product created');
     res.redirect('/admin/products');
  })
  .catch(err => console.log(err))
};

exports.postEditProduct = (req, res, next) => {
   const prodId = req.body.productId;
   const updatedTitle = req.body.title;
   const updatedPrice = req.body.price;
   const updatedImageUrl = req.body.imageUrl;
   const updatedDesc = req.body.description;

   Product.findByPk(prodId)
      .then(product => {
         product.title = updatedTitle;
         product.price = updatedPrice;
         product.description = updatedDesc;
         product.imageUrl = updatedImageUrl;
         return product.save();
      })
      .then(result => {
         console.log('updated product');
         res.redirect('/admin/products');
      })
      .catch(err => console.log(err));
};

exports.getEditProduct =  (req, res, next) => {
   const editMode = req.query.edit;
   if(!editMode) return res.redirect('/');

   const prodId = req.params.productId;
   console.log(req.user);
   req.user.getProducts({ where: { id: prodId } })
      .then(products => {
          const product = products[0];
          if(!product) {
            return res.redirect('/');
         }
         res.render('admin/editProduct', {
            pageTitle: 'Add product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product,
         })
      })
      .catch(err => console.log(err))
};


exports.getProducts = (req, res, next) => {
    req.user.getProducts()
      .then(products => {
         res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
         });
      })
      .catch(err => console.log(err))
};

exports.postDeleteProduct = (req, res, next) => {
   const prodId = req.body.productId;
   Product
      .findByPk(prodId)
      .then(product => {
         return product.destroy()
      })
      .then(result => {
         console.log('product removed');
         res.redirect('/admin/products');
      })
      .catch(err => console.log(err));
};

