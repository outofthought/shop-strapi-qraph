import React, { Component } from "react";
import { Container, Box, Button, Heading, Text, TextField } from "gestalt";
import ToastMessage from "./ToastMessage";
import Strapi from "strapi-sdk-javascript/build/main";
import { getCart, calculatePrice } from "../utils";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

export default class Checkout extends Component {
  state = {
    toast: false,
    toastMessage: "",
    loading: false,
    city: "",
    postalCode: "",
    address: "",
    confirmationEmailAddress: "",
    cartItems: []
  };
  componentDidMount() {
    this.setState({ cartItems: getCart() });
  }
  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({
      [event.target.name]: value
    });
  };
  handleConfirmOrder = async event => {
    event.preventDefault();

    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill in all fields");
      return;
    }

    try {
      this.setState({
        loading: true
      });

      // const response = await strapi.register(
      //   address,
      //   postalCode,
      //   city,
      //   confirmationEmailAddress
      // );

      // this.setState({
      //   loading: false
      // });

      // console.log(response);

      // this.redirectUser("/");
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

    setTimeout(
      () =>
        this.setState({
          toast: false,
          toastMessage: ""
        }),
      3000
    );
  };
  isFormEmpty = ({ address, city, postalCode, confirmationEmailAddress }) => {
    return !address || !city || !postalCode || !confirmationEmailAddress;
  };
  render() {
    const {
      toast,
      toastMessage,
      address,
      city,
      postalCode,
      confirmationEmailAddress,
      cartItems
    } = this.state;
    return (
      <Container>
        <Box
          color="darkWash"
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Heading color="midnight">Checkout</Heading>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            direction="column"
            marginTop={2}
            marginBottom={4}
          >
            <Text color="darkGray" italic bold>
              {cartItems.length} items for Checkout
            </Text>
            <Box margin={2}>
              {cartItems.map(item => (
                <Box key={item._id}>
                  <Text pading={1} color="blue" bold>
                    {item.name} x {item.quantity} = $
                    {item.price * item.quantity}
                  </Text>
                </Box>
              ))}
              <Text bold>
                Total amount:
                <Text color="orange" bold>
                  ${calculatePrice(cartItems)}
                </Text>
              </Text>
            </Box>
          </Box>

          <form
            style={{
              display: "inlineBlock",
              textAlign: "center",
              maxWidth: 450
            }}
            onSubmit={this.handleConfirmOrder}
          >
            <Box
              marginBottom={2}
              display="flex"
              direction="column"
              alignItems="center"
            >
              <TextField
                id="address"
                type="text"
                name="address"
                placeholder="Shipping address"
                onChange={this.handleChange}
              />

              <TextField
                id="postalCode"
                type="number"
                name="postalCode"
                placeholder="Postal Code"
                onChange={this.handleChange}
              />

              <TextField
                id="city"
                type="text"
                name="city"
                placeholder="City of Residence"
                onChange={this.handleChange}
              />
              <TextField
                id="confirmationEmailAddress"
                type="text"
                name="confirmationEmailAddress"
                placeholder="Confirmation Email Address"
                onChange={this.handleChange}
              />
              <button id="stripe__button" type="submit">
                submit
              </button>
            </Box>
          </form>
        </Box>
        <ToastMessage message={toastMessage} show={toast} />
      </Container>
    );
  }
}
