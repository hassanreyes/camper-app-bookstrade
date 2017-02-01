import React                from "react";
import Auth                 from "../auth";
import EmailAndPassword     from "../components/auth/emailAndPassword";

export default class SignUp extends React.Component {
    
    constructor(props){
        super(props);
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
        this.state = { email: '', password: '' };
    }
    
    handleSubmit(e) {
        e.preventDefault();
        var email = this.state.email;//$("#email").val();
        var password = this.state.password; //$("#password").val();
        
        $.post('/auth/signup', { email: email, password: password })
            .done((data) => {
                Auth.User(data.user);
                Auth.Token(data.token);
                
                // var headers = { 'Authorization': data.token };
                // $.ajax('/', { headers: headers });
                
                location.href = '/';
            })
            .fail((data) => {
                document.getElementById("error-message").innerText = data.error;
            });
    }
    
    handleChange(field, value){
        const state = {};
        state[field] = value;
        this.setState(state);
    }
    
    render(){
        return(
            <div>
            <h2>SignUp</h2>
            <div className="well">
                <p id="error-message" className="bg-danger"></p>
                <form id="signup-form" onSubmit={this.handleSubmit}>
                    
                    <EmailAndPassword email={this.state.email} password={this.state.password} onChange={this.handleChange}/>
                    
                    <button type="submit" className="btn btn-primary">LogOn</button>
                </form>
            </div>
            </div>
        );
    }
    
} 