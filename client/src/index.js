import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import "gestalt/dist/gestalt.css";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Checkout from "./components/Checkout";
import Navbar from "./components/Navbar";
import Brews from "./components/Brews";
import { getToken } from "./utils/index";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      getToken() !== null ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const Root = () => {
  return (
    <Router>
      <React.Fragment>
        <Navbar />
        <Switch>
          <Route component={App} exact path="/" />
          <Route component={SignIn} path="/signin" />
          <Route component={SignUp} path="/signup" />
          <PrivateRoute component={Checkout} path="/checkout" />
          <Route component={Brews} path="/:brandId" />
        </Switch>
      </React.Fragment>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
registerServiceWorker();

if (module.hot) {
  module.hot.accept();
}
