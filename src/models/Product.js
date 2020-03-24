export class Product{
    name = '';
    serialNo = '';
    image = '';
    description = '';
    price = '';
    quantity = '';
    _id = null;

    
    constructor(product) {
        if(!product) {
            return;
        }
        this.name = product.name;
        this.serialNo = product.serialNo;
        this.image = product.image;
        this.description = product.description;
        this.price = product.price;
        this.quantity = product.quantity;
        this._id = (product._id) ? product._id : '';
    }
}