import React from "react";

export default class EmailAndPassword extends React.Component {
    
    constructor(props){
        super(props);
        
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(e){
        if(this.props.onChange) {
            var name = e.target.name;
            this.props.onChange(name, e.target.value);
        }
    }
    
    render(){
        
        var emailInput = <input type="email" className="form-control" id="email" name="email" 
                placeholder="Email" value={this.props.email} onChange={this.handleChange} disabled={this.props.disabled} />;
            
        var passwordInput = <input type="password" className="form-control" id="password" name="password" 
                placeholder="Password" value={this.props.password} onChange={this.handleChange} disabled={this.props.disabled} />;
        
        return(
            <div>
                <div className="input-group input-group-lg">
                    <label htmlFor="email">Email address</label>
                    {emailInput}
                </div>
                <div className="form-group input-group-lg">
                    <label htmlFor="password">Password</label>
                    {passwordInput}
                </div>
            </div>
        );
    }
    
}

EmailAndPassword.propTypes = {
    email        : React.PropTypes.string,
    password    : React.PropTypes.string,
    disabled    : React.PropTypes.bool,
    onChange    : React.PropTypes.func
}

EmailAndPassword.defaultProps = {
    disabled: false
}