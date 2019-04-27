const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
   Product
      .fetchAll()
      .then(products => {
         res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All products',
            path: '/products',
         });
      })
      .catch(err => {
         console.log(err)
      });
};

exports.getProduct = (req, res, next) => {
   const prodId = req.params.productId;
   // Product
   //    .findAll({where: {id: prodId}})
   //    .then(products => {
   //       res.render('shop/product-detail', {
   //          product: products[0],
   //          pageTitle: products[0].title,
   //          path: '/products'
   //       })
   //    })
   //    .catch(err => console.log(err));
   Product
      .findById(prodId)
      .then(product => {
         res.render('shop/product-detail', {
            product,
            pageTitle: product.title,
            path: '/products'
         })
      })
      .catch(err => console.log(err))
};

exports.getIndex = (req, res, next) => {
   Product
      .fetchAll()
      .then(products => {
         res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
         });
      })
      .catch(err => {
         console.log(err)
      });
};

exports.getCart = (req, res, next) => {
   req.user
      .getCart()
      .then(products => {
         res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products,
         });
      })
      .catch(err => console.log(err))
};

exports.postCart = (req, res, next) => {
   const prodId = req.body.productId;
   Product
      .findById(prodId)
      .then(product => {
         return req.user.addToCart(product);
      })
      .then(result => {
         console.log(result);
         res.redirect('/cart')
      })
      .catch(err => console.log(err))
};

exports.postCartDeleteProduct = (req, res, next) => {
   const prodId = req.body.productId;
   req.user
      .deleteItemFromCart(prodId)
      .then(result => {
         res.redirect('/cart');
      })
      .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
   let fetchCart;

   req.user
      .getCart()
      .then(cart => {
         fetchCart = cart;
         return cart.getProducts();
      })
      .then(products => {
         return req.user
            .createOrder()
            .then(order => {
               return order.addProducts(
                  products.map(product => {
                     product.orderItem = { quantity: product.cartItem.quantity };
                     return product
                  })
               )
            })
            .catch(err => console.log(err))
      })
      .then(result => {
         return fetchCart.setProducts;
      })
      .then(result => {
         res.redirect('/orders');
      })
      .catch(err => console.log(err))
};

exports.getOrders = (req, res, next) => {
   res.user
      .getOrders({include: ['products']})
      .then(orders => {
         res.render('shop/orders', {
            orders,
            path: '/orders',
            pageTitle: 'Your Orders',
         });
      })
      .catch(err => console.log(err))

};
