import React, { Component } from "react";
import Strapi from "strapi-sdk-javascript/build/main";
import { Box, Heading, Text, Image, Card, Button } from "gestalt";

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

export default class Brews extends Component {
  state = {
    brand: "",
    brews: []
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
        brews: response.data.brand.brews
      });
      console.log(this.state);
    } catch (err) {
      console.error(err);
    }
  }
  render() {
    const { brand, brews } = this.state;
    return (
      <Box
        marginTop={4}
        display="flex"
        justifyContent="center"
        alignItems="start"
      >
        <Box display="flex" direction="column" alignItems="center">
          <Box margin={2}>
            <Heading color="orchid">{brand}</Heading>
          </Box>
          <Box
            dangerouslySetInlineStyle={{
              __style: {
                backgroundColor: "#d6c8ec"
              }
            }}
            shape="rounded"
            display="flex"
            justifyContent="center"
            padding={4}
          >
            {brews.map(brew => (
              <Box paddingY={4} key={brew._id} margin={2} width={200}>
                <Card
                  image={
                    <Box heigth={250} width={200}>
                      <Image
                        alt="Brew"
                        naturalWidth={1}
                        naturalHeight={1}
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
                      <Text bold size="xl">
                        {brew.name}
                      </Text>
                    </Box>
                    <Text>{brew.price}</Text>

                    <Button color="blue" text="Add to cart" />
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }
}
