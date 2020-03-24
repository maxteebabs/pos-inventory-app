export class OrderItem{
    itemName = '';
    itemCode = '';
    amount = 0;
    quantity = 1;
    total = 0;
    _id = null;

    
    constructor(item) {
        if(!item) {
            return;
        }
        this.itemName = item.itemName;
        this.itemCode = item.itemCode;
        this.amount = item.amount;
        this.quantity = item.quantity;
        this._id = (item._id) ? item._id : '';
        this.total = this.quantity * this.amount;
    }
}