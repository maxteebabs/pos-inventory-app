const Helpers =  {
    format(int) {
        return (int > 9) ? int : '0'+int;
    },
    async isAdmin(user_id) {
        const User = require('../models/User');
        let user = await User.findOne({ deleted: null, _id : user_id, isAdmin: true });
        if(user) {
            return true;
        }
        return false;
    },
    generateToken() {
        var crypto = require('crypto');
        const buf = crypto.randomBytes(25);
        return buf.toString('hex');
    },
    generateID() {
        let d = new Date();
        return d.getFullYear().toString().substr(2) + 
            Helpers.format(1+d.getMonth()) + 
            Helpers.format(d.getDate()).toString() +
            Helpers.format(d.getSeconds()).toString() +
            d.getMilliseconds().toString();
    },
    paginate(
        currentPage //this is the current page
        , pageSize //total items per page
        , totalItems //total rows returned
        ) {
        let totalPages = Math.ceil(totalItems / pageSize);
        let pages = [];
        if(currentPage < 1) {
            currentPage = 1;
        }else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        //calulate the start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = (pageSize - 1) + startIndex;

        //lets create our pages
        if(currentPage < 5) {
            for(let i = 1; i <= currentPage; i++) {
                pages.push(i);
            }
            if(totalPages - 5 > currentPage) {
                for(let i = totalPages -4; i < totalPages; i++) {
                    pages.push(i);
                }
            }
            pages.push(totalPages);
        }else if(currentPage > 5 && (currentPage + 3) < totalPages) {
            pages.push(1);
            for(let i = currentPage - 3; i <= currentPage + 3; i++) {
                pages.push(i);
            }
            pages.push(totalPages);
        }else if(currentPage > totalPages - 5 ){
            pages.push(1);
            for(let i = currentPage; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            pages: pages,
            startIndex: startIndex,
            endIndex: endIndex
        }
    }
};
module.exports = Helpers;