import EventEmitter         from "wolfy87-eventemitter";
import axios                from "axios";

//Authorization service class
class Auth {
    
    constructor(){
        this.ee = new EventEmitter();
    }
    
    User(user){
        if(user) return localStorage.setItem("user", user);
        else return localStorage.getItem("user");
    }
    
    Token(token){
        if(token) return localStorage.setItem("token", token);
        else return localStorage.getItem("token");
    }
    
    ApiKey(){
        return 'AIzaSyAsZ_ozCZLd6J_dq8DvKifCniTKRhqEZic'; 
    }
    
    logOut(){
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }
    
    isLoggedIn(){
        return Boolean(this.User());
    }
    
    isAuthorized(){
        let token = this.Token();
        if(!token) return new $.Deferred().resolve(false);
        else {
            var headers = { 'authorization': token };
            return $.ajax('/auth/signin', 
            {   method: 'GET',
                headers: headers
            })
            .done((data) => {
                return true;
            })
            .fail((data) => {
                return false;
            }).promise();
        }
    }
    
    getAxiosInstance() {
        return axios.create({
                headers: {'authorization': this.Token()}
            });
    }
    
    //Events
    
    onProfileChange(cb){
        this.ee.addListener('profileChange', cb);
    }
}

export default new Auth();