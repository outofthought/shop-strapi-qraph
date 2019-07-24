import React from "react";
import { Box, Text, Heading, Image, Button } from "gestalt";
import { NavLink } from "react-router-dom";
import { getToken, clearCart, clearToken } from "../utils";
import { withRouter } from "react-router-dom";

//mongodb+srv://katielamber03:<password>@cluster0-fkkk4.mongodb.net/test?retryWrites=true&w=majority

class Navbar extends React.Component {
  handleSignOut = () => {
    //redirect
    //clear token
    //clear cart
    clearCart();
    clearToken();
    this.props.history.push("/");
  };
  render() {
    return getToken() !== null ? (
      <AuthNav handleSignOut={this.handleSignOut} />
    ) : (
      <UnAuthNav />
    );
  }
}
const AuthNav = ({ handleSignOut }) => {
  return (
    <Box
      height={70}
      padding={1}
      color="midnight"
      shape="roundedBottom"
      display="flex"
      alignItems="center"
      justifyContent="around"
    >
      <NavLink to="/checkout" activeClassName="active">
        <Text size="xl" color="white">
          Checkout
        </Text>
      </NavLink>

      <NavLink to="/" exact activeClassName="active">
        <Box display="flex" alignItems="center">
          <Box margin={2} height={50} width={50}>
            <Image
              alt="BreHaha Logo"
              src="./icons/logo.svg"
              naturalHeight={1}
              naturalWidth={1}
            />
          </Box>
          <Heading size="xs" color="orange">
            BrewHaha
          </Heading>
        </Box>
      </NavLink>

      <Button
        color="transparent"
        text="Sign Out"
        inline
        size="md"
        onClick={handleSignOut}
      />
    </Box>
  );
};
const UnAuthNav = () => {
  return (
    <Box
      height={70}
      padding={1}
      color="midnight"
      shape="roundedBottom"
      display="flex"
      alignItems="center"
      justifyContent="around"
    >
      <NavLink to="/signin" activeClassName="active">
        <Text size="xl" color="white">
          Sign In
        </Text>
      </NavLink>

      <NavLink to="/" exact activeClassName="active">
        <Box display="flex" alignItems="center">
          <Box margin={2} height={50} width={50}>
            <Image
              alt="BreHaha Logo"
              src="./icons/logo.svg"
              naturalHeight={1}
              naturalWidth={1}
            />
          </Box>
          <Heading size="xs" color="orange">
            BrewHaha
          </Heading>
        </Box>
      </NavLink>

      <NavLink to="/signup" activeClassName="active">
        <Text size="xl" color="white">
          Sign Up
        </Text>
      </NavLink>
    </Box>
  );
};

export default withRouter(Navbar);
