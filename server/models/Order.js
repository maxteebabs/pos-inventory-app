var mongoose = require('mongoose');
let orderSchema = new mongoose.Schema({
    orderID: {type: String, required: true},
    referenceID: {type: String, required: false},
    status: {type: String},
    vat: {type: String},
    total: {type: Number, default: 0},
    netTotal: {type: Number, default: 0},
    isSent: {type: Boolean, default: false},
    description: {type: String, default: ''},
    customer_name: {type: String, default: ''},
    paymentMethod: {type: String, default: ''},
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deleted: {type: Date, default: null},
    date_entered: {type: Date, default: Date.now()},
    date_modified: {type: Date, default: Date.now()}
});
module.exports = mongoose.model('Order', orderSchema);