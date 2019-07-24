import React, { Component } from "react";
import { Container, Box, Button, Heading, Text, TextField } from "gestalt";
import ToastMessage from "./ToastMessage";
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    toast: false,
    toastMessage: "",
    loading: false
  };
  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({
      [event.target.name]: value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { email, password } = this.state;
    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill in all fields");
      return;
    }

    try {
      this.setState({
        loading: true
      });

      const response = await strapi.login(email, password);

      this.setState({
        loading: false
      });

      console.log(response);

      this.redirectUser("/");
    } catch (err) {
      this.setState({
        loading: false
      });

      this.showToast(err.message);
    }
  };

  showToast = toastMessage => {
    this.setState({
      toast: true,
      toastMessage
    });
    // after 5s hide it
    setTimeout(
      () =>
        this.setState({
          toast: false,
          toastMessage: ""
        }),
      3000
    );
  };

  redirectUser = path => this.props.history.push(path);

  isFormEmpty = ({ email, password }) => {
    return !email || !password;
  };
  render() {
    const { toast, toastMessage } = this.state;
    return (
      <Container>
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#d6a3b1"
            }
          }}
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
        >
          <form
            style={{
              display: "inlineBlock",
              textAlign: "center",
              maxWidth: 450
            }}
            onSubmit={this.handleSubmit}
          >
            <Box
              marginBottom={2}
              display="flex"
              direction="column"
              alignItems="center"
            >
              <Heading color="midnight">Welcome back!</Heading>
              <Text italic color="orchid">
                Sign in to order some brews!
              </Text>

              <TextField
                id="email"
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={this.handleChange}
              />

              <TextField
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                onChange={this.handleChange}
              />
              <Button inline color="blue" text="Submit" type="submit" />
            </Box>
          </form>
        </Box>
        <ToastMessage message={toastMessage} show={toast} />
      </Container>
    );
  }
}
export default SignIn;
