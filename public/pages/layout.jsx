import React                from "react";
import { IndexLink, Link }  from "react-router";
import { connect }          from "react-redux";
import Auth                 from "../auth";
import * as userActions     from "../actions/userActions";

class Layout extends React.Component {
    
    constructor(props){
        super(props);
    }
    
    handleLogOut(e){
      e.preventDefault();
      
      Auth.logOut();
      location.href = "/";
    }
    
    componentWillMount(){
      let auth = Auth.isAuthorized();
      auth.then((res) => {
        if(res.user){
          this.props.dispatch(userActions.fetchProfile(res.user.profile));
        }
      })
      .catch((res) => {
        Auth.logOut();
        location.href = "/";
      });
    }
    
    renderAppLinks(){
        
        const user = Auth.User();
        let books = user? <li> <Link to="allbooks">All Books</Link> </li> : null;
        let mybooks = user ? <li> <Link to="mybooks">My Books</Link> </li> : null;

        return (
            <ul className="nav navbar-nav">
                <li>
                    <IndexLink to="/">Home</IndexLink>
                </li>
                {books}
                {mybooks}
            </ul>
        );
    }
    
    renderProfileLinks(){
        
        const user = Auth.User();
        if(user) {
            
            const displayName = this.props.profile ? `${this.props.profile.firstName} ${this.props.profile.lastName}` : 'Anonymous';//(user.profile && user.profile.firstName) ? user.profile.firstName : 'Anonymous';
            
            return (
                <ul className="nav navbar-nav navbar-right">
                  <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" 
                      role="button" aria-haspopup="true" aria-expanded="false">
                      {displayName}
                      <span className="caret"></span>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                          <Link to="profile">Profile</Link>
                      </li>
                      <li><a href="/#" onClick={this.handleLogOut}>LogOut</a></li>
                    </ul>
                  </li>
                </ul>
            );
        } else {
          return (
            <ul className="nav navbar-nav navbar-right">
                <li>
                    <Link to="signin">SignIn</Link>
                </li>
                <li>
                    <Link to="signup">SignUp</Link>
                </li>
            </ul>
          );
        }
    }
    
    render() {
        const { location } = this.props;
        const containerStyle = {
          marginTop: "60px"
        };
    
    return (
      <div>

        <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            
            { this.renderAppLinks() }
            
            { this.renderProfileLinks() }
            
          </div>
        </div>
      </nav>

        <div className="container" style={containerStyle}>
          <div className="row">
            <div className="col-lg-12">

              {this.props.children}

            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default connect((state) => {
    return {
        profile: state.user.profile
    };
})(Layout);