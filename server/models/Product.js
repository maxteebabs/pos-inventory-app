var mongoose = require('mongoose');
let productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    serialNo: {type: String},
    price: {type: Number, default: 0},
    quantity: {type: Number, default: 0},
    description: String,
    images: String,
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    modified_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deleted: {type: Date, default: null},
    date_entered: {type: Date, default: Date.now()},
    date_modified: {type: Date, default: Date.now()}
});
module.exports = mongoose.model('Product', productSchema);