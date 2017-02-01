import React, { PropTypes}  from "react";
import { connect }          from "react-redux";
import update               from "react-addons-update"; 
import Auth                 from "../auth";
import EmailAndPassword     from "../components/auth/emailAndPassword";
import * as userActions     from "../actions/userActions";

class Profile extends React.Component {
    
    constructor(props){
        super(props);
        
        this.componentWillMount = this.componentWillMount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
        this.state = { user : { profile: {} } };
    }
    
    handleSubmit(e){
        e.preventDefault();
        
        var headers = { 'authorization': Auth.Token() };
        $.ajax('/auth/profile', 
            {   method: 'POST',
                headers: headers,
                data: { user: this.state.user }
            })
            .done((data) => {
                Auth.User(data.user);
                this.setState( { user: data.user });
                document.getElementById("succ-message").innerText = 'Profile Updated!';
                
                if(this.props.onChange){
                    this.props.onChange(this.state.user);
                }
                
                this.props.dispatch(userActions.fetchProfile(data.user.profile));
            })
            .fail((data) => {
                document.getElementById("error-message").innerText = data.error;
            });
    }
    
    handleChange(e){
        var name = e.target.name;
        var value = e.target.value;
        var user = this.state.user;
        
        user.profile[name] = value;
        
        this.setState({ user: user });
    }
    
    componentWillMount(){
        if(!Auth.isLoggedIn()) location.href = '/auth/signin';
        
        var headers = { 'authorization': Auth.Token() };
        $.ajax('/auth/profile', 
            {   method: 'GET',
                headers: headers,
            })
            .done((data) => {
                this.setState(
                    { user: 
                        { 
                            email: data.user.email,
                            password: data.user.password,
                            profile: {
                                firstName: data.user.profile.firstName,
                                lastName: data.user.profile.lastName,
                                city: data.user.profile.city
                            }
                        }
                    });
            })
            .fail((data) => {
                document.getElementById("error-message").innerText = data.error;
            });
    }
    
    render(){
        return(
            <div>
            <h2>Profile</h2>
            <div className="well">
                <p id="error-message" className="bg-danger"></p>
                <p id="succ-message" className="bg-info"></p>
                <form id="profile-form" onSubmit={this.handleSubmit}>
                    
                    <EmailAndPassword email={this.state.user.email} password={this.state.user.password} disabled={true}/>
                    
                    <hr/>
                    <div className="input-group input-group-lg">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" className="form-control" id="firstName" name="firstName" 
                            placeholder="First Name" value={this.state.user.profile.firstName}
                            onChange={this.handleChange}/>
                    </div>
                    <div className="input-group input-group-lg">
                        <label htmlFor="firstName">Last Name</label>
                        <input type="text" className="form-control" id="lastName" name="lastName" 
                            placeholder="Last Name" value={this.state.user.profile.lastName}
                            onChange={this.handleChange}/>
                    </div>
                    <div className="input-group input-group-lg">
                        <label htmlFor="city">City</label>
                        <input type="text" className="form-control" id="city" name="city" 
                            placeholder="City" value={this.state.user.profile.city}
                            onChange={this.handleChange}/>
                    </div>
                    <hr/>
                    <button type="submit" className="btn btn-primary btn-lg">Save</button>
                </form>
            </div>
            </div>
        );
    }
    
} 

// Profile.propTypes = {
//     onUpdateProfile: PropTypes.func.isRequired
// };

export default connect((store) => {
    return {
        profile: store.user.profile
    };
})(Profile);