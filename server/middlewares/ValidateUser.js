// @ts-ignore
const jwt = require('jsonwebtoken');

module.exports =  (req, res, next) => {
    jwt.verify(req.headers['x-access-token']
        , process.env.SECRET, function(err, decoded) {
      if (err) {
        res.status(405).json({ status:"error", message: err.message, data:null });
      }else{
        // add user id to request
        req.body.userId = decoded.id;
        next();
      }
    });  
  }