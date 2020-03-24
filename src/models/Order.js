export class Order{
    customer_name = '';
    paymentMethod = '';
    total = 0;
    netTotal = 0;
    description = '';
    created_by = '';
    referenceID = '';
    _id = null;
    items = [];
    vat = 0;    
    constructor(order) {
        if(!order) {
            return;
        }
        this.customer_name = order.customer_name;
        this.paymentMethod = order.paymentMethod;
        this.total = order.total;
        this.netTotal = order.netTotal;
        this.items = order.items;
        this.description = order.description;
        this.referenceID = order.referenceID;
        this.created_by = order.created_by;
        this.vat = order.vat;
        this._id = (order._id) ? order._id : '';
    }
}