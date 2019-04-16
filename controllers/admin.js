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
   const product = new Product(null, title, imageUrl, price, description);

   product
      .save()
      .then(() => {
         res.redirect('/')
      })
      .catch(err => console.log(err))

   res.redirect('/');
};

exports.postEditProduct = (req, res, next) => {
   const prodId = req.body.productId;
   const updatedTitle = req.body.title;
   const updatedPrice = req.body.price;
   const updatedImageUrl = req.body.imageUrl;
   const updatedDesc = req.body.description;

   const updatedProduct = new Product(
      prodId,
      updatedTitle,
      updatedImageUrl,
      updatedPrice,
      updatedDesc
   );

   updatedProduct.save();
   res.redirect('/admin/products');
};

exports.getEditProduct =  (req, res, next) => {
   const editMode = req.query.edit;
   if(!editMode) {
      return res.redirect('/')
   }

   const prodId = req.params.productId;
   Product.findById(prodId, product => {
      if(!product) {
         return res.redirect('/');
      }
      res.render('admin/editProduct', {
         pageTitle: 'Add product',
         path: '/admin/edit-product',
         editing: editMode,
         product: product,
      })
   });
};


exports.getProducts = (req, res, next) => {
   Product.fetchAll((products) => {
      res.render('admin/products', {
         prods: products,
         pageTitle: 'Admin Products',
         path: '/admin/products'
      });
   });
};

exports.postDeleteProduct = (req, res, next) => {
   const prodId = req.body.productId;
   Product.deleteById(prodId);
   res.redirect('/admin/products');
};
