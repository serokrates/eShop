import React from "react";
import { Component } from "react";
import "./App.css";
import store from "./Redux/store";
import {
  categoryType,
  currencyType,
  adjustQty,
  removeFromCart,
  sumPrice,
} from "./Redux/Shopping/shopping-actions";
import logo from "./images/logo2.svg";
import cartImg from "./images/cartImg.svg";
import cartCircle from "./images/cartCircle.svg";
import { connect } from "react-redux/es/exports";
import { Link } from "react-router-dom";
import plus from "./images/plus.svg";
import minus from "./images/minus.svg";
import Price from "./price.js";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTo: this.props.data2,
      Categories: [],
      currencyMenuActive: false,
      cartMenuActive: false,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  categoriesSet = () => {
    let array = [];
    for (let variable in this.props.data2) {
      array.push({ category: variable });
    }
    this.setState({
      Categories: array,
    });
  };
  countThePrice = () => {
    let countedPrice = 0;
    if (store.getState().shop.cart.length !== 0) {
      for (let i = 0; i < store.getState().shop.cart.length; i++) {
        countedPrice =
          countedPrice +
          store.getState().shop.cart[i].qty *
            store.getState().shop.cart[i].prices[
              store.getState().shop.currentCurrency.id
            ].amount;
      }
    }
    if (store.getState().shop.cart.length === 0) {
      countedPrice = 0;
    }
    this.setState({
      countedPrice: countedPrice,
    });
    store.dispatch(sumPrice(countedPrice));
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
  GetMenuActive = () => {
    this.state.currencyMenuActive === true
      ? this.setState({ currencyMenuActive: false })
      : this.setState({ currencyMenuActive: true });
  };
  GetCartMenuActive = () => {
    this.state.cartMenuActive === true
      ? this.setState({ cartMenuActive: false })
      : this.setState({ cartMenuActive: true });
  };
  componentDidMount() {
    this.categoriesSet();
    this.countThePrice();
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  ChangeCurrency = (event) => {
    store.dispatch(
      currencyType(
        event.currentTarget.id,
        this.state.dataTo[store.getState().shop.categoryType.name][1].prices[
          event.currentTarget.id
        ].currency.label,
        this.state.dataTo[store.getState().shop.categoryType.name][1].prices[
          event.currentTarget.id
        ].currency.symbol
      )
    );
    this.countThePrice();
  };
  GetIdClick = (event) => {
    store.dispatch(categoryType(event.currentTarget.id));
  };

  render() {
    return (
      <div>
        <Link to="/">
          <div className="horMenu">
            {this.state.Categories.map(({ category, key }, i = 0) => (
              <li className="liMenu">
                {store.getState().shop.categoryType.name === category ? (
                  <a
                    id={category}
                    key={i}
                    className="underlined"
                    onClick={this.GetIdClick}
                  >
                    {category}
                  </a>
                ) : (
                  <a id={category} key={i} onClick={this.GetIdClick}>
                    {category}
                  </a>
                )}
              </li>
            ))}
          </div>
        </Link>
        <img className="logo" alt="location-reference" src={logo} />
        <div className="actions">
          <div className="group">
            <div className="frame" onClick={this.GetMenuActive}>
              {this.state.currencyMenuActive === true ? (
                <div>
                  <div
                    className="overlayCurrency"
                    style={{ display: "block" }}
                    onClick={this.GetMenuActive}
                  ></div>
                  <div className="colapsibleMenu">
                    {this.state.dataTo[
                      store.getState().shop.categoryType.name
                    ].map(({ prices, currency, symbol, key }, i) =>
                      i === 1 ? (
                        prices.map(({ currency, symbol, key }, i) => (
                          <div
                            className="price"
                            key={i}
                            id={i}
                            onClick={this.ChangeCurrency}
                          >
                            <p>
                              {currency.symbol} {currency.label}{" "}
                            </p>
                          </div>
                        ))
                      ) : (
                        <></>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="currencyChose">
                {store.getState().shop.currentCurrency.symbol}
              </div>
              {this.state.currencyMenuActive === false ? (
                <div className="p">^</div>
              ) : (
                <div className="pp">^</div>
              )}
            </div>
          </div>
          {store.getState().shop.cart.length !== 0 ? (
            <div
              onClick={
                this.state.cartMenuActive === true
                  ? null
                  : this.GetCartMenuActive
              }
            >
              <img
                className="cartImageMenu"
                alt="location-reference"
                src={cartImg}
                onClick={this.GetCartMenuActive}
              />
              {store.getState().shop.cart.length !== 0 ? (
                <div className="cartItemCount">
                  <img
                    className="cartImageMenu"
                    alt="location-reference"
                    src={cartCircle}
                  />
                  <div>{store.getState().shop.itemCount}</div>
                </div>
              ) : (
                <></>
              )}
              {this.state.cartMenuActive === true ? (
                <div>
                  <div
                    className="overlay"
                    style={{ display: "block" }}
                    onClick={this.GetCartMenuActive}
                  ></div>
                  <div className="colapsibleMenuCart">
                    <div className="containerCart">
                      {store
                        .getState()
                        .shop.cart.map(({ name, gallery, prices }, key) => (
                          <div id={key} className="itemContainerCart">
                            <div className="textContainerCart">
                              <div className="textCart">
                                <div className="namePriceCart">
                                  <div className="attributeTitle">{name}</div>
                                  <div className="price">
                                    {
                                      store.getState().shop.currentCurrency
                                        .symbol
                                    }
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
                                      <div className="attributes" key={key2}>
                                        <div>{name}:</div>
                                        {store.getState().shop.cart[key]
                                          .attributes[key2].type ===
                                        "swatch" ? (
                                          <div className="attributesVariants">
                                            {store
                                              .getState()
                                              .shop.cart[key].attributes[
                                                key2
                                              ].items.map(
                                                (
                                                  { displayValue, value },
                                                  key3
                                                ) =>
                                                  store.getState().shop.cart[
                                                    key
                                                  ].attributes[key2].items[key3]
                                                    .displayValue ===
                                                  store.getState().shop.cart[
                                                    key
                                                  ].attrValues[1][key2] ? (
                                                    store.getState().shop.cart[
                                                      key
                                                    ].attributes[key2].items[
                                                      key3
                                                    ].displayValue ===
                                                    "White" ? (
                                                      <div className="borderBox">
                                                        <div
                                                          key={key3}
                                                          typeof="text"
                                                          className="attributeValuesColors"
                                                          style={{
                                                            backgroundColor:
                                                              value,
                                                            width: "15px",
                                                            height: "15px",
                                                          }}
                                                        ></div>
                                                      </div>
                                                    ) : (
                                                      <div className="borderBox">
                                                        <div
                                                          key={key3}
                                                          typeof="text"
                                                          className="attributeValuesColors"
                                                          style={{
                                                            backgroundColor:
                                                              value,
                                                          }}
                                                        ></div>
                                                      </div>
                                                    )
                                                  ) : store.getState().shop
                                                      .cart[key].attributes[
                                                      key2
                                                    ].items[key3]
                                                      .displayValue ===
                                                    "White" ? (
                                                    <div
                                                      key={key3}
                                                      typeof="text"
                                                      className="attributeValuesColors"
                                                      style={{
                                                        backgroundColor: value,
                                                        border:
                                                          "0.5px solid black",
                                                        width: "15px",
                                                        height: "15px",
                                                      }}
                                                    ></div>
                                                  ) : (
                                                    <div
                                                      key={key3}
                                                      typeof="text"
                                                      className="attributeValuesColors"
                                                      style={{
                                                        backgroundColor: value,
                                                      }}
                                                    ></div>
                                                  )
                                              )}
                                          </div>
                                        ) : (
                                          <div className="attributesVariants">
                                            {store
                                              .getState()
                                              .shop.cart[key].attributes[
                                                key2
                                              ].items.map(
                                                ({ displayValue }, key3) =>
                                                  store.getState().shop.cart[
                                                    key
                                                  ].attributes[key2].items[key3]
                                                    .displayValue ===
                                                  store.getState().shop.cart[
                                                    key
                                                  ].attrValues[1][key2] ? (
                                                    <div
                                                      key={key3}
                                                      typeof="text"
                                                      className="attributeValues"
                                                      style={{
                                                        backgroundColor:
                                                          "black",
                                                        color: "white",
                                                      }}
                                                    >
                                                      {displayValue}
                                                    </div>
                                                  ) : (
                                                    <div
                                                      key={key3}
                                                      typeof="text"
                                                      className="attributeValues"
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
                            <div className="buttonsCart">
                              <img
                                className="plus"
                                id={key}
                                alt="location-reference"
                                src={plus}
                                onClick={() => {
                                  this.increment(key);
                                }}
                              />
                              <div>{store.getState().shop.cart[key].qty}</div>
                              <img
                                className="minus"
                                id={key}
                                alt="location-reference"
                                src={minus}
                                onClick={() => this.decrement(key)}
                              />
                            </div>
                            <img
                              className="imageContainerCart"
                              alt="location-reference"
                              src={
                                Object.keys(
                                  store.getState().shop.cart[key].gallery
                                ).length === 1
                                  ? `${gallery}`
                                  : `${gallery[1]}`
                              }
                            />
                          </div>
                        ))}
                      <Price></Price>
                    </div>
                    <div className="buttonsCartMenu">
                      <Link
                        to="/cartSite"
                        dataTo
                        style={{ textDecoration: "none" }}
                      >
                        <button
                          className="buttonCartMenu"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#1D1F22",
                          }}
                        >
                          <p>VIEW BAG</p>
                        </button>
                      </Link>
                      <button
                        className="buttonCartMenu"
                        style={{
                          backgroundColor: "#5ECE7B",
                          border: "none",
                          color: "#ffffff",
                        }}
                      >
                        <p>CHECK OUT</p>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <img
              className="cartImageMenu"
              alt="location-reference"
              src={cartImg}
            />
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
export default connect(mapStateToProps)(Menu);
