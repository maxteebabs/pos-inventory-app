const express = require('express');
const router = express.Router();
const auth = require('./auth');
const ProductController = require('../controller/ProductController');
const OrderController = require('../controller/OrderController');
var AuthGuard = require('../middlewares/ValidateUser');

const UserController = require('../controller/UserController');


module.exports = (router) => {
    auth(router);
    //products
    router.route('/product/store').post(AuthGuard, ProductController.store);
    router.route('/product/update/:id').patch(AuthGuard, ProductController.update);
    router.route('/product/find/:id').get(AuthGuard, ProductController.find);
    router.route('/product/delete/:id').delete(AuthGuard, ProductController.destroy);
    router.route('/products/options').get(AuthGuard, ProductController.getAllOptions);
    router
      .route("/products/search/")
      .post(AuthGuard, ProductController.search);
    router.route('/products/').get(AuthGuard, ProductController.findAll);

    //orders
    router.route('/orders').get(AuthGuard, OrderController.findAll);
    router.route('/order/store').post(AuthGuard, OrderController.store);
    router.route('/order/find/:id').get(AuthGuard, OrderController.find);
    // router.route("/orders/search/").post(AuthGuard, OrderController.search);
    // router.route('/order/update/:id').patch(AuthGuard, OrderController.update);

    //users
    router.route("/users").get(AuthGuard, UserController.findAll);
    router.route("/user/delete/:id").delete(AuthGuard, UserController.destroy);
}
