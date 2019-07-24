import React, { Component } from "react";
import Strapi from "strapi-sdk-javascript/build/main";
import {
  Box,
  Heading,
  Text,
  Image,
  Card,
  Button,
  Mask,
  IconButton
} from "gestalt";
import { Link } from "react-router-dom";
import { calculatePrice, getCart, setCart } from "../utils";

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

export default class Brews extends Component {
  state = {
    brand: "",
    brews: [],
    cartItems: []
  };
  async componentDidMount() {
    try {
      const response = await strapi.request("POST", "/graphql", {
        data: {
          query: `query{
            brand(id:"${this.props.match.params.brandId}"){
             _id
             name  
             brews{
               _id
               price
               name
               description
               image{
                 url
               }
             }
           }
             
           }`
        }
      });
      console.log(response);
      this.setState({
        brand: response.data.brand.name,
        brews: response.data.brand.brews,
        cartItems: getCart()
      });
      console.log(this.state);
    } catch (err) {
      console.error(err);
    }
  }
  addToCart = brew => {
    // check if a brew is already in the cart
    const alreadyInCart = this.state.cartItems.findIndex(
      item => item._id === brew._id
    );

    if (alreadyInCart === -1) {
      const updatedItems = this.state.cartItems.concat({
        ...brew,
        quantity: 1
      });
      this.setState({ cartItems: updatedItems }, () => {
        setCart(updatedItems);
      });
    } else {
      const updatedItems = [...this.state.cartItems];
      updatedItems[alreadyInCart].quantity += 1;
      this.setState({ cartItems: updatedItems }, () => {
        setCart(updatedItems);
      });
    }
  };

  deleteItemFromCart = itemToDeleteId => {
    const filteredItems = this.state.cartItems.filter(
      item => item._id !== itemToDeleteId
    );
    this.setState({ cartItems: filteredItems }, () => {
      setCart(filteredItems);
    });
  };

  render() {
    const { brand, brews, cartItems } = this.state;
    return (
      <Box
        marginTop={4}
        display="flex"
        justifyContent="center"
        alignItems="start"
        dangerouslySetInlineStyle={{
          __style: {
            flexWrap: "wrap-reverse"
          }
        }}
      >
        <Box display="flex" direction="column" alignItems="center">
          <Box margin={2}>
            <Heading color="orchid">{brand}</Heading>
          </Box>

          <Box
            dangerouslySetInlineStyle={{
              __style: {
                backgroundColor: "#bdcdd9"
              }
            }}
            shape="rounded"
            display="flex"
            justifyContent="center"
            padding={4}
          >
            {brews.map(brew => (
              <Box margin={2} width={210} paddingY={4} key={brew._id}>
                <Card
                  image={
                    <Box height={250} width={200}>
                      <Image
                        alt="Brand"
                        fit="cover"
                        naturalHeight={1}
                        naturalWidth={1}
                        src={`${apiUrl}${brew.image.url}`}
                      />
                    </Box>
                  }
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    direction="column"
                  >
                    <Box marginBottom={2}>
                      <Text size="xl">{brew.name}</Text>
                    </Box>

                    <Text>{brew.description}</Text>
                    <Text color="orchid">${brew.price}</Text>
                    <Box marginTop={2}>
                      <Text size="xl">
                        <Button
                          onClick={() => this.addToCart(brew)}
                          // onClick={() => console.log("added")}
                          color="blue"
                          text="Add to Cart"
                        />
                      </Text>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        <Box marginTop={2} marginLeft={8} alignSelf="end">
          <Mask shape="rounded" wash>
            <Box
              display="flex"
              direction="column"
              alignItems="center"
              padding={2}
            >
              <Heading align="center" size="sm">
                Your Cart
              </Heading>
              <Text color="gray" italic>
                {cartItems.length} items selected
              </Text>

              {cartItems.map(item => (
                <Box key={item._id} display="flex" alignItems="center">
                  <Text>
                    {item.name} x {item.quantity} - $
                    {(item.quantity * item.price).toFixed(2)}
                  </Text>
                  <IconButton
                    accessibilityLabel="Delete Item"
                    icon="heart"
                    size="sm"
                    iconColor="red"
                    onClick={() => this.deleteItemFromCart(item._id)}
                    // onClick={() => console.log("deleted")}
                  />
                </Box>
              ))}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                direction="column"
              >
                <Box margin={2}>
                  {cartItems.length === 0 && (
                    <Text color="red">Please select some items</Text>
                  )}
                </Box>
                <Text size="lg">Total: ${calculatePrice(cartItems)}</Text>
                <Text>
                  <Link to="/checkout">Checkout</Link>
                </Text>
              </Box>
            </Box>
          </Mask>
        </Box>
      </Box>
    );
  }
}
