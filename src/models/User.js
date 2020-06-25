export class User{
    isActive = false;
    email = '';
    fullname = '';
    id = '';
    isAdmin = false;
    token = '';
    
    constructor(user) {
        if(!user) {
            return;
        }
        this.email = user.email;
        this.fullname = user.fullname;
        this.id = user._id;
        this.isActive = user.isActive;
        this.token = user.token;
        this.isAdmin = user.isAdmin;
    }
}