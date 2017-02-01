import React        from "react";
import ReactDOM     from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import Layout       from "./pages/layout.jsx";
import Home         from "./pages/home";
import AllBooks        from "./pages/allbooks";
import MyBooks      from "./pages/mybooks";
import SignIn       from "./pages/signin";
import SignUp       from "./pages/signup";
import Profile      from "./pages/profile";
import { createStore, applyMiddleware, compose } from "redux";
import thunk        from "redux-thunk";
import { Provider } from "react-redux";
import reducer      from "./reducers";

//Redux inialitation
const thunkMidd = applyMiddleware(thunk);
const middleware = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() 
    ? compose(thunkMidd, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) 
    : thunkMidd;
var store = createStore(reducer, middleware);

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={Layout}>
              <IndexRoute component={Home}></IndexRoute>
              <Route path="allbooks" name="allbooks" component={AllBooks}></Route>
              <Route path="mybooks" name="mybooks" component={MyBooks}></Route>
              <Route path="signup" name="signup" component={SignUp}></Route>
              <Route path="signin" name="signin" component={SignIn}></Route>
              <Route path="profile" name="profile" component={Profile}></Route>
            </Route>
        </Router>
    </Provider>,
  document.getElementById('app')
);
