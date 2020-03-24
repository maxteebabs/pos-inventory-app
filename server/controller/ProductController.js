// @ts-nocheck
let Product = require('../models/Product');
var fs = require('fs');
var ProductController = {
  /**
   * @description get all products
   * @method findAll
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} response object
   */
  limit: 20,
  findAll: (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    let offset = 0;
    let page = req.query.page || 1;
    let limit = ProductController.limit;
    if (page && page > 0) {
      offset = (page - 1) * limit;
    }
    //count all products
    Product.countDocuments((err, total_rows) => {
      if (err) {
        return res
          .status(401)
          .json({ status: false, error: "Failed to load Products" });
      }
      Product.find((err, products) => {
        if (err || !products) {
          return res
            .status(401)
            .json({ status: false, error: "Failed to load Products" });
        }

        var p = products.map((product, index) => {
          if (product.images) {
            let obj = {};
            var paths = JSON.parse(product.images);
            obj.image = fs.readFileSync(paths[0], { encoding: "base64" });
            obj.name = product.name;
            obj.images = product.images;
            obj.price = product.price;
            obj.description = product.description;
            obj.created_by = product.created_by;
            obj.modified_by = product.modified_by;
            obj.date_entered = product.date_entered;
            obj.quantity = product.quantity;
            obj.serialNo = product.serialNo;
            obj._id = product._id;
            return obj;
          }
          return product;
        });
        let total_pages = Math.ceil(total_rows / limit);
        let response = {
          products: p,
          total_rows: total_rows,
          page,
          total_pages
        };
        return res.status(200).json(response);
      })
        .skip(offset)
        .limit(limit)
        .sort({ date_entered: -1 });
    });
  },
  search: (req, res, next) => { 
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    let search = req.body.search;
    var query = {};
    // query.name = search;
    query.serialNo = search;
    let offset = 0;
    let page = req.query.page || 1;
    let limit = ProductController.limit;
    if (page && page > 0) {
      offset = (page - 1) * limit;
    }
    //count all products
    Product.countDocuments( (err, total_rows) => {
      if (err) {
        return res
          .status(401)
          .json({ status: false, error: "Failed to load Products" });
      }
      Product.find(
        {
          $or: [{ name: new RegExp(search, "i") }, { serialNo: search }]
        },
        (err, products) => {
          if (err || !products) {
            return res.status(401).json({ status: false, error: err });
          }

          var p = products.map((product, index) => {
            if (product.images) {
              let obj = {};
              var paths = JSON.parse(product.images);
              obj.image = fs.readFileSync(paths[0], { encoding: "base64" });
              obj.name = product.name;
              obj.images = product.images;
              obj.price = product.price;
              obj.description = product.description;
              obj.created_by = product.created_by;
              obj.modified_by = product.modified_by;
              obj.date_entered = product.date_entered;
              obj.quantity = product.quantity;
              obj.serialNo = product.serialNo;
              obj._id = product._id;
              return obj;
            }
            return product;
          });
          let total_pages = Math.ceil(total_rows / limit);
          let response = {
            products: p,
            total_rows: total_rows,
            page,
            total_pages
          };
          return res.status(200).json(response);
        }
      )
        .skip(offset)
        .limit(limit)
        .sort({ date_entered : -1 });
    });
  },
  find: (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    Product.findOne({ _id: req.params.id }, (err, product) => {
      if (err || !product) {
        return res
          .status(401)
          .json({ status: false, error: "Invalid Request" });
      }
      var paths = JSON.parse(product.images);
      product.images = fs.readFileSync(paths[0], { encoding: "base64" });
      return res.status(200).json({ status: "success", product: product });
    });
  },
  store: (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

    if (!req.body.name || !req.body.price) {
      return res.status(401).json({ error: "Failed to save product" });
    }
    var image_urls = [];
    if (req.body.image) {
      var images = JSON.parse(req.body.image);

      for (var i = 0; i < images.length; i++) {
        var base64Data = images[i].replace(/^data:image\/\w+;base64,/, "");
        // var base64Data = image.replace(/^data:image\/png;base64,/, "");
        var bitmap = new Buffer(base64Data, "base64");
        var ds = Date.now();
        var url = `images/products/pos-${ds}.png`;
        image_urls.push(url);
        fs.writeFile(url, bitmap, err => {
          console.log(err);
        });
      }
    }
    let product = new Product();
    product.name = req.body.name;
    product.serialNo = req.body.serialNo;
    product.price = req.body.price;
    product.quantity = req.body.quantity;
    product.description = req.body.description;
    product.created_by = req.body.userId;
    product.images = JSON.stringify(image_urls);
    product.modified_by = req.body.userId;

    product.save(err => {
      if (err) {
        return res.status(401).json(err);
      } else {
        return res.status(200).json({ status: "success", product: product });
      }
    });
  },
  update: (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    try {
      if (!req.body.name || !req.body.price || !req.params.id) {
        return res.status(401).json({ error: "Failed to Update product" });
      }
      Product.findOne({ _id: req.params.id }, (err, product) => {
        if (err || !product) {
          throw err;
        }
        var image_urls = [];
        if (req.body.image && req.body.image.length > 0) {
          var images = JSON.parse(req.body.image);

          for (var i = 0; i < images.length; i++) {
            var base64Data = images[i].replace(/^data:image\/\w+;base64,/, "");
            var bitmap = new Buffer(base64Data, "base64");
            var ds = Date.now();
            var url = `images/products/pos-${ds}.png`;
            image_urls.push(url);
            fs.writeFile(url, bitmap, err => {
              console.log(err);
            });
          }
        }
        product.name = req.body.name;
        product.serialNo = req.body.serialNo;
        product.price = req.body.price;
        product.quantity = req.body.quantity;
        product.description = req.body.description;
        product.modified_by = req.body.userId;
        if (image_urls.length > 0) {
          product.images = image_urls;
        }
        product.date_modified = Date.now();
        product.save(err => {
          if (err) {
            return res.status(401).json(err);
          } else {
            return res
              .status(200)
              .json({ status: "success", product: product });
          }
        });
      });
    } catch (err) {
      return res.status(401).json(err);
    }
  },
  destroy: (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    try {
      Product.findOne({ _id: req.params.id }, (err, product) => {
        if (err || !product) {
          throw err;
        }
        product.deleted = Date.now();
        product.save();
        return res.status(200).json({ msg: "product deleted successfully." });
      });
    } catch (err) {
      return res.status(401).json(err);
    }
  },
  getAllOptions: (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    Product.find(
      { deleted: null },
      null,
      { sort: { date_entered: -1 } },
      (err, products) => {
        if (err || !products) {
          return res
            .status(401)
            .json({ status: false, error: "Invalid request" });
        }
        var p = products.map((product, index) => {
          let obj = {
            value: product._id,
            label: product.name,
            itemCode: product.serialNo,
            price: product.price
          };
          return obj;
        });
        return res.status(200).json({ products: p });
      }
    );
  }
};
module.exports = ProductController; 