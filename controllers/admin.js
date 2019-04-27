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

   const product = new Product(
      title,
      price,
      description,
      imageUrl,
      null,
      req.user._id
   );
   product.save()
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

   Product.findById(prodId)
      const product = new Product(
         updatedTitle,
         updatedPrice,
         updatedDesc,
         updatedImageUrl,
         prodId
      );
      product
         .save()
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
   Product.findById(prodId)
      .then(product => {
         if (!product) return res.redirect('/');

         res.render('admin/editProduct', {
            pageTitle: 'Add product',
            path: '/admin/edit-product',
            editing: editMode,
            product,
         })
      })
      .catch(err => console.log(err))
};

exports.getProducts = (req, res, next) => {
   Product.fetchAll()
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
   Product.deleteById(prodId)
      .then(() => {
         console.log('product removed');
         res.redirect('/admin/products');
      })
      .catch(err => console.log(err));
};
