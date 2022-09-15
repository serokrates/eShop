import React from "react";
import { useQuery, gql } from "@apollo/client";
import { render } from "@testing-library/react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Component, useState, useLayoutEffect } from "react";
import "./App.css";
import store from "./Redux/store";
import { sumPrice } from "./Redux/Shopping/shopping-actions";
import { connect } from "react-redux/es/exports";

class Price extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    console.log("render");
    return (
      <div className="priceContainer">
        <div className="total">Total: </div>
        <div className="totalPrice">
          {store.getState().shop.sumPrice}
          {store.getState().shop.currentCurrency.symbol}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  sumPrice: state.shop.sumPrice,
  currentCurrency: state.shop.currentCurrency,
});
export default connect(mapStateToProps)(Price);
