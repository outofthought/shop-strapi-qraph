import React, { Component } from "react";
import {
  Box,
  Heading,
  Container,
  Card,
  Image,
  Text,
  SearchField,
  Icon,
  Spinner
} from "gestalt";
import Strapi from "strapi-sdk-javascript/build/main";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: [],
    searchTerm: "",
    loadingBrands: true
  };
  async componentDidMount() {
    try {
      const response = await strapi.request("POST", "/graphql", {
        data: {
          query: `query{
            brands{
              _id
              name
              description
              
              image{
                name
                url
              }
            }
          }`
        }
      });
      console.log(response);
      this.setState({ brands: response.data.brands, loadingBrands: false });
      console.log(this.state.brands);
    } catch (err) {
      console.error(err);
      this.setState({ loadingBrands: false });
    }
  }
  handleChange = ({ value }) => {
    this.setState({ searchTerm: value });
  };
  filterBrands = ({ brands, searchTerm }) => {
    return brands.filter(brand => {
      return (
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };
  render() {
    const { searchTerm, loadingBrands } = this.state;
    return (
      <Container>
        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField
            id="searchField"
            accessibilityLabel="Brands Search Field"
            placeholder="Search Brands"
            onChange={this.handleChange}
            value={searchTerm}
          />
          <Box margin={2}>
            <Icon
              icon="filter"
              color={searchTerm ? "orange" : "gray"}
              size={20}
              accessibilityLabel="Filter"
            />
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" marginBottom={2}>
          <Heading color="midnight" size="md">
            New Brands
          </Heading>
        </Box>
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#d6c8ec"
            }
          }}
          shape="rounded"
          wrap
          display="flex"
          justifyContent="around"
        >
          {this.filterBrands(this.state).map(brand => (
            <Box paddingY={4} key={brand._id} margin={2} width={200}>
              <Card
                image={
                  <Box heigth={200} width={200}>
                    <Image
                      alt="Brand"
                      naturalWidth={1}
                      naturalHeight={1}
                      src={`${apiUrl}${brand.image.url}`}
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
                  <Text bold size="xl">
                    {brand.name}
                  </Text>
                  <Text>{brand.description}</Text>
                  <Text bold size="xl">
                    <Link to={`/${brand._id}`}>See Brews</Link>
                  </Text>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
        <Spinner show={loadingBrands} accessibilityLabel="Loading Spinner" />
        {/* <Loader show={loadingBrands} /> */}
      </Container>
    );
  }
}

export default App;
