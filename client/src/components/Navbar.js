import React from "react";
import { Box, Text, Heading, Image } from "gestalt";
import { NavLink } from "react-router-dom";

//mongodb+srv://katielamber03:<password>@cluster0-fkkk4.mongodb.net/test?retryWrites=true&w=majority
export default function Navbar() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="around"
      height={70}
      color="midnight"
      padding={1}
      shape="roundedBottom"
    >
      <NavLink to="/signin">
        <Text size="xl" color="white">
          SignIn
        </Text>
      </NavLink>
      <NavLink exact to="/">
        <Box display="flex" alignItems="center" margin={2}>
          <Box height={50} width={50}>
            <Image
              alt="MyLogo logo"
              naturalHeight={1}
              naturalWidth={1}
              src="./icons/logo.svg"
            />
          </Box>

          <Heading size="xs" color="orange">
            Brew
          </Heading>
        </Box>
      </NavLink>
      <NavLink to="/signup">
        <Text size="xl" color="white">
          SignUp
        </Text>
      </NavLink>
    </Box>
  );
}
