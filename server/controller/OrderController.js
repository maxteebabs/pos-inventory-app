// @ts-nocheck
let Order = require('../models/Order');
let Product = require('../models/Product');
let OrderItem = require('../models/OrderItem');
let Helpers = require('../helpers/utils');

let OrderController = {
  limit: 20,
  findAll: (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    let offset = 0;
    let page = req.query.page || 1;
    let limit = OrderController.limit;
    if (page && page > 0) {
      offset = (page - 1) * limit;
    }
    //count all products
    Order.countDocuments((err, total_rows) => {
      if (err) {
        return res
          .status(401)
          .json({ status: false, error: "Failed to load Products" });
      }
      Order.find({ deleted: null }, null, {
        sort: { date_entered: -1 },
        skip: offset,
        limit: limit
      })
        .populate("created_by")
        .then(orders => {
          if (!orders) {
            return res
              .status(401)
              .json({ status: false, error: "Invalid request" });
          }
          let total_pages = Math.ceil(total_rows / limit);
          let response = {
            orders: orders,
            total_rows: total_rows,
            page,
            total_pages
          };
          return res.status(200).json(response);
        });
    });
  },
//   search: (req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     let search = req.body.search;
//     var query = {};
//     // query.name = search;
//     query.serialNo = search;
//     let offset = 0;
//     let page = req.query.page || 1;
//     let limit = OrderController.limit;
//     if (page && page > 0) {
//       offset = (page - 1) * limit;
//     }
//     //count all orders
//     Order.countDocuments((err, total_rows) => {
//       if (err) {
//         return res
//           .status(401)
//           .json({ status: false, error: "Failed to load Products" });
//       }
//       Order.find(
//         {
//           $or: [{ created_by: new RegExp(search.toString(), "i") }, { orderID: search }]
//         },
//         (err, orders) => {
//           if (err || !orders) {
//             return res.status(401).json({ status: false, error: err });
//           }
          
//           let total_pages = Math.ceil(total_rows / limit);
//           let response = {
//             orders: orders,
//             total_rows: total_rows,
//             page,
//             total_pages
//           };
//           return res.status(200).json(response);
//         }
//       )
//         .skip(offset)
//         .limit(limit)
//         .sort({ date_entered : -1 });
//     });
//   },
  find: async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    Order.findOne({ _id: req.params.id })
      .populate("created_by")
      .then(async order => {
        if (!order) {
          return res
            .status(401)
            .json({ status: false, error: "Invalid Request" });
        }
        //get the items
        let items = await OrderItem.find({ orderID: order._id });
        return res
          .status(200)
          .json({ status: "success", order: order, items: items });
      });
  },
  store: async (req, res, next) => {
    try {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );

      if (req.body.amount === 0) {
        return res.status(401).json({ error: "Amount cannot be 0" });
      }
      if (req.body.total === 0) {
        return res.status(401).json({ error: "Total cannot be 0" });
      }
      if (req.body.netTotal === 0) {
        return res.status(401).json({ error: "Net Total cannot be 0" });
      }
      if (req.body.items.length === 0) {
        return res.status(401).json({ error: "Items cannot be empty" });
      }
      //lets create the orderID
      let code = Helpers.generateID();

      let order = new Order();
      order.orderID = code;
      order.customer_name = req.body.customer_name;
      // order.paymentMethod = req.body.paymentMethod;
      order.total = req.body.total;
      order.vat = req.body.vat;
      order.netTotal = req.body.netTotal;
      // order.description = req.body.description;
      // order.referenceID = req.body.referenceID;
      order.created_by = req.body.userId;
      order.save((err, o) => {
        if (err) {
          return res.status(401).json(err);
        } else {
          //save the order items
          req.body.items.map((item, index) => {
            let orderItem = new OrderItem();
            orderItem.itemName = item.itemName;
            orderItem.amount = item.amount;
            orderItem.total = item.total;
            orderItem.created_by = req.body.userId;
            orderItem.quantity = item.quantity;
            orderItem.itemCode = item.itemCode;
            orderItem.orderID = o._id;
            let res = orderItem.save((err, oi) => {
              if (err) {
                throw err;
              } else {
                return oi;
              }
            });
            return res;
          });
          // console.log(itemResponse);
          return res
            .status(200)
            .json({ status: "success", order: order, items: req.body.items });
        }
      });
    } catch (err) {
      console.log(err.Message());
      // return res.status(401).json(err);
    }
  },
  destroy: (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    try {
      Order.findOne({ _id: req.params.id }, (err, order) => {
        if (err || !order) {
          throw err;
        }
        order.deleted = Date.now();
        order.save();
        return res.status(200).json({ msg: "order deleted successfully." });
      });
    } catch (err) {
      return res.status(401).json(err);
    }
  },
};
module.exports = OrderController;