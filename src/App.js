import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import "./App.css";
import PokemonList from "./PokemonList";
import Menu from "./Menu";
import { Component } from "react";
import store from "./Redux/store";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTo: [],
      categoriesSet: [],
      AllProducts: [],
    };
    this.querryAsk = this.querryAsk.bind(this);
  }
  createData = (dataIn) => {
    const prod = [];
    const categories = {};
    for (let i = 0; i < dataIn.categories.length; i++) {
      prod[dataIn.categories[i].name] = dataIn.categories[i].products;
      categories[i] = dataIn.categories[i];
    }
    this.setState({
      AllProducts: prod,
      categoriesSet: dataIn,
    });
  };
  querryAsk = async () => {
    const client = new ApolloClient({
      uri: "http://localhost:4000/",
      cache: new InMemoryCache(),
    });
    const { data } = await client.query({
      query: gql`
        query ExampleQuery {
          categories {
            name
            products {
              name
              description
              gallery
              inStock
              attributes {
                id
                name
                type
                items {
                  displayValue
                  value
                  id
                }
              }
              prices {
                amount
                currency {
                  label
                  symbol
                }
              }
            }
          }
        }
      `,
    });
    this.createData(data);
    this.setState({
      dataTo: data,
      categoryName: store.getState().shop.categoryType.name,
    });
  };
  componentDidMount = async () => {
    this.querryAsk();
  };
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <div className="Menu" onClick={() => this.querryAsk()}>
            {Object.keys(this.state.AllProducts).length ? (
              <Menu data2={this.state.AllProducts} />
            ) : (
              "not loaded Menu"
            )}
          </div>
          <div className="categoryText">
            Category: {this.state.categoryName}
          </div>
          <div className="container">
            {Object.keys(this.state.AllProducts).length ? (
              <PokemonList data={this.state.AllProducts} />
            ) : (
              "not loaded PokemonList"
            )}
          </div>
        </div>
      </ApolloProvider>
    );
  }
}
export default App;
