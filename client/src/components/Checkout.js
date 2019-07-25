import React, { Component } from "react";
import {
  Container,
  Box,
  Button,
  Heading,
  Text,
  TextField,
  Modal,
  Spinner
} from "gestalt";
import ToastMessage from "./ToastMessage";
import Strapi from "strapi-sdk-javascript/build/main";
import { getCart, calculatePrice } from "../utils";
import {
  Elements,
  StripeProvider,
  CardElement,
  InjectStripe,
  injectStripe
} from "react-stripe-elements";

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);
//console.log(strapi);

export default class __CheckoutForm extends Component {
  state = {
    toast: false,
    toastMessage: "",
    loading: false,
    city: "",
    postalCode: "",
    address: "",
    confirmationEmailAddress: "",
    cartItems: [],
    orderProcessing: false,
    modal: false
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
    this.setState({ modal: true });
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
  handleSubmitOrder = () => {};
  closeModal = () => {
    this.setState({ modal: false });
  };
  render() {
    const {
      toast,
      toastMessage,
      address,
      city,
      postalCode,
      confirmationEmailAddress,
      cartItems,
      orderProcessing,
      modal
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
          {cartItems.length > 0 ? (
            <React.Fragment>
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
                  <Text bold>Total amount: ${calculatePrice(cartItems)}</Text>
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
                  {/* <CardElement
                    id="stripe__input"
                    onReady={input => input.focus()}
                  /> */}
                  <button id="stripe__button" type="submit">
                    submit
                  </button>
                </Box>
              </form>
            </React.Fragment>
          ) : (
            <Box color="darkWash" shape="rounded" padding={4}>
              <Heading align="center" color="watermelon" size="xs">
                Your cart is empty
              </Heading>
              <Text align="center" italic color="green">
                Please add some brews!
              </Text>
            </Box>
          )}
        </Box>
        {modal && (
          <ConfirmationModal
            orderProcessing={orderProcessing}
            closeModal={this.closeModal}
            handleSubmitOrder={this.handleSubmitOrder}
            cartItems={cartItems}
          />
        )}
        <ToastMessage message={toastMessage} show={toast} />
      </Container>
    );
  }
}
const ConfirmationModal = ({
  orderProcessing,
  closeModal,
  handleSubmitOrder,
  cartItems
}) => (
  <Modal
    accessibilityCloseLabel="close"
    accessibilityModalLabel="Confirm your order"
    heading="Confirm your order"
    onDismiss={closeModal}
    footer={
      <Box
        display="flex"
        marginRight={-1}
        marginLeft={-1}
        justifyContent="center"
      >
        <Box padding={1}>
          <Button
            size="lg"
            color="red"
            text="Submit"
            disabled={orderProcessing}
            onClick={handleSubmitOrder}
          />
        </Box>
        <Box padding={1}>
          <Button
            size="lg"
            text="Cancel"
            disabled={orderProcessing}
            onClick={closeModal}
          />
        </Box>
      </Box>
    }
    role="alertdialog"
    size="sm"
  >
    {!orderProcessing && (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        direction="column"
        padding={2}
        color="lightWash"
      >
        {cartItems.map(item => (
          <Box key={item._id} padding={1}>
            <Text size="lg" color="red">
              {item.name}X{item.quanity}-${item.quantity * item.price}
            </Text>
          </Box>
        ))}
        <Box paddingY={2}>
          <Text size="lg" bold>
            Total:{calculatePrice(cartItems)}
          </Text>
        </Box>
      </Box>
    )}
    <Spinner
      show={orderProcessing}
      accessibilityLabel="Order Processing Spinner"
    />
    <Text align="center" italic>
      Submitting Order
    </Text>
  </Modal>
);

// const CheckoutForm = () => injectStripe(__CheckoutForm);
// const Checkout = () => (
//   <StripeProvider apiKey="pk_test_oZMagPbnjaEZZORjZnupmRqE009PLtcwYo">
//     <Elements>
//       <CheckoutForm />
//     </Elements>
//   </StripeProvider>
// );
