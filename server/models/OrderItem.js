var mongoose = require('mongoose');
let orderItemSchema = new mongoose.Schema({
    orderID: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    itemName: {type: String, required: true},
    amount: {type: Number, default: 0, required: true},
    itemCode: {type: String, default: ''},
    total: {type: Number, default: 0, required: true},
    quantity: { type: Number, default: 1, required: true},
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deleted: {type: Date, default: null},
    date_entered: {type: Date, default: Date.now()},
    date_modified: {type: Date, default: Date.now()}
});
module.exports = mongoose.model('OrderItem', orderItemSchema);