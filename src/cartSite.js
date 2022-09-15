import React from "react";
import { gql } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { Component } from "react";
import "./App.css";
import store from "./Redux/store";
import {
  adjustQty,
  removeFromCart,
  sumPrice,
} from "./Redux/Shopping/shopping-actions";
import { connect } from "react-redux/es/exports";
import plus from "./images/plus.svg";
import minus from "./images/minus.svg";
import Menu from "./Menu";

class cartSite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTo2: [],
      AllProducts: [],
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
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
      dataTo2: data,
      categoryName: store.getState().shop.categoryType.name,
    });
  };
  decrement = (key) => {
    let qty = store.getState().shop.cart[key].qty;
    let newQty = qty - 1;

    newQty === 0
      ? store.dispatch(
          removeFromCart(
            store.getState().shop.cart[key].name,
            store.getState().shop.cart[key].attrValues
          )
        ) && this.countThePrice()
      : store.dispatch(
          adjustQty(
            store.getState().shop.cart[key].name,
            qty,
            newQty,
            store.getState().shop.cart[key].attrValues,
            store.getState().shop.itemCount
          )
        );
    this.countThePrice();
  };
  increment = (key) => {
    let qty = store.getState().shop.cart[key].qty;
    let newQty = qty + 1;

    store.dispatch(
      adjustQty(
        store.getState().shop.cart[key].name,
        qty,
        newQty,
        store.getState().shop.cart[key].attrValues,
        store.getState().shop.itemCount
      )
    );
    this.countThePrice();
  };
  countThePrice = () => {
    let countedPrice = 0;
    for (let i = 0; i < store.getState().shop.cart.length; i++) {
      countedPrice =
        countedPrice +
        store.getState().shop.cart[i].qty *
          store.getState().shop.cart[i].prices[
            store.getState().shop.currentCurrency.id
          ].amount;
    }
    store.dispatch(sumPrice(countedPrice));
  };
  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions);
    window.scrollTo(0, 0);
    this.querryAsk();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  render() {
    return (
      <div className="App">
        <div className="Menu" onClick={() => this.querryAsk()}>
          {Object.keys(this.state.dataTo2).length ? (
            <Menu data2={this.state.AllProducts} />
          ) : (
            "not loaded Menu"
          )}
        </div>
        <div className="containerCartSite">
          {store.getState().shop.cart.length !== 0 ? (
            store.getState().shop.cart.map(({ name, gallery, prices }, key) => (
              <div id={key} className="itemContainerCartSite">
                <div className="borderBoxCartSite"></div>
                <div className="textContainerCart">
                  <div className="textCart">
                    <div className="namePriceCart">
                      <div className="attributeTitleItemSite">{name}</div>
                      <div className="price">
                        {store.getState().shop.currentCurrency.symbol}
                        {
                          store.getState().shop.cart[key].prices[
                            store.getState().shop.currentCurrency.id
                          ].amount
                        }
                      </div>
                    </div>
                    {store
                      .getState()
                      .shop.cart[key].attributes.map(
                        ({ id, name, items }, key2) => (
                          <div className="attributesCartSite" key={key2}>
                            <div className="textItemSite">{name}:</div>
                            {store.getState().shop.cart[key].attributes[key2]
                              .type === "swatch" ? (
                              <div className="attributesVariantsItemSite">
                                {store
                                  .getState()
                                  .shop.cart[key].attributes[key2].items.map(
                                    ({ displayValue, value }, key3) =>
                                      store.getState().shop.cart[key]
                                        .attributes[key2].items[key3]
                                        .displayValue ===
                                      store.getState().shop.cart[key]
                                        .attrValues[1][key2] ? (
                                        store.getState().shop.cart[key]
                                          .attributes[key2].items[key3]
                                          .displayValue === "White" ? (
                                          <div className="borderBoxItemSite">
                                            <div
                                              key={key3}
                                              typeof="text"
                                              className="attributeValuesColorsItemSite"
                                              style={{
                                                backgroundColor: value,
                                                width: "31px",
                                                height: "31px",
                                              }}
                                            ></div>
                                          </div>
                                        ) : (
                                          <div className="borderBoxItemSite">
                                            <div
                                              key={key3}
                                              typeof="text"
                                              className="attributeValuesColorsItemSite"
                                              style={{ backgroundColor: value }}
                                            ></div>
                                          </div>
                                        )
                                      ) : store.getState().shop.cart[key]
                                          .attributes[key2].items[key3]
                                          .displayValue === "White" ? (
                                        <div
                                          key={key3}
                                          typeof="text"
                                          className="attributeValuesColorsItemSite"
                                          style={{
                                            backgroundColor: value,
                                            border: "0.5px solid black",
                                            width: "31px",
                                            height: "31px",
                                          }}
                                        ></div>
                                      ) : (
                                        <div
                                          key={key3}
                                          typeof="text"
                                          className="attributeValuesColorsItemSite"
                                          style={{ backgroundColor: value }}
                                        ></div>
                                      )
                                  )}
                              </div>
                            ) : (
                              <div className="attributesVariants">
                                {store
                                  .getState()
                                  .shop.cart[key].attributes[key2].items.map(
                                    ({ displayValue }, key3) =>
                                      store.getState().shop.cart[key]
                                        .attributes[key2].items[key3]
                                        .displayValue ===
                                      store.getState().shop.cart[key]
                                        .attrValues[1][key2] ? (
                                        <div
                                          key={key3}
                                          typeof="text"
                                          className="attributeValuesItemsite"
                                          style={{
                                            backgroundColor: "black",
                                            color: "white",
                                          }}
                                        >
                                          {displayValue}
                                        </div>
                                      ) : (
                                        <div
                                          key={key3}
                                          typeof="text"
                                          className="attributeValuesItemsite"
                                        >
                                          {displayValue}
                                        </div>
                                      )
                                  )}
                              </div>
                            )}
                          </div>
                        )
                      )}
                  </div>
                </div>
                <div className="buttonsCartSite">
                  <img
                    className="plusCartSite"
                    id={key}
                    alt="location-reference"
                    src={plus}
                    onClick={() => {
                      this.increment(key);
                    }}
                  />
                  <div>{store.getState().shop.cart[key].qty}</div>
                  <img
                    className="minusCartSite"
                    id={key}
                    alt="location-reference"
                    src={minus}
                    onClick={() => this.decrement(key)}
                  />
                </div>
                <img
                  className="imageContainerCartSite"
                  alt="location-reference"
                  src={
                    Object.keys(store.getState().shop.cart[key].gallery)
                      .length === 1
                      ? `${gallery}`
                      : `${gallery[1]}`
                  }
                />
                {store.getState().shop.cart[key + 1] ? (
                  <></>
                ) : (
                  <div
                    className="borderBoxCartSite"
                    style={{ bottom: "-25px" }}
                  ></div>
                )}
              </div>
            ))
          ) : (
            <div
              style={{
                height: "100%",
                width: "100%",
                fontSize: "50px",
                fontFamily: "Raleway",
              }}
            >
              Cart is empty
            </div>
          )}
          {store.getState().shop.cart.length !== 0 ? (
            <div className="containerCartSiteData">
              <div className="containerCartSiteDataInner">
                <div style={{ width: "auto" }}>
                  <div className="priceContainerCartSite">
                    <div className="totalCartSite">Tax 21%: </div>
                  </div>
                  <div className="priceContainerCartSite">
                    <div className="totalCartSite">Quantity: </div>
                  </div>
                  <div className="priceContainerCartSite">
                    <div className="totalCartSite">Total: </div>
                  </div>
                </div>
                <div style={{ width: "auto%", marginLeft: "5px" }}>
                  <div className="priceContainerCartSite">
                    <div className="totalPriceCartSite">
                      {store.getState().shop.currentCurrency.symbol}
                      {0.21 * store.getState().shop.sumPrice}
                    </div>
                  </div>
                  <div className="priceContainerCartSite">
                    <div className="totalPriceCartSite">
                      {store.getState().shop.itemCount}
                    </div>
                  </div>
                  <div className="priceContainerCartSite">
                    <div className="totalPriceCartSite">
                      {store.getState().shop.currentCurrency.symbol}
                      {store.getState().shop.sumPrice}
                    </div>
                  </div>
                </div>
              </div>
              <button className="buttonCartSite">
                <p>Order</p>
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  sumPrice: state.shop.sumPrice,
  itemCount: state.shop.itemCount,
  cart: state.shop.cart,
  qty: state.shop.cart.qty,
});
export default connect(mapStateToProps)(cartSite);
