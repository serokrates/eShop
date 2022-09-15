import React from "react";
import { Component } from "react";
import store from "./Redux/store";
import {
  addToCart,
  loadCurrentItem,
  removeCurrentItem,
  sumPrice,
} from "./Redux/Shopping/shopping-actions";
import imageCart from "./images/imageCart.svg";
import { Link } from "react-router-dom";
import { connect } from "react-redux/es/exports";

class PokemonList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: [],
    };
  }
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
  componentDidMount() {}
  CurrentItem = (event) => {
    if (store.getState().shop.firstTime === 1) {
      store.dispatch(removeCurrentItem(event.currentTarget.id));
    }
    store.dispatch(
      loadCurrentItem(
        this.props.data[store.getState().shop.categoryType.name][
          event.currentTarget.id
        ].name,
        this.props.data[store.getState().shop.categoryType.name]
      )
    );
  };
  GetIdClick = (event) => {
    let defaultAttr = [
      0,
      Array(
        Object.keys(
          this.props.data[store.getState().shop.categoryType.name][
            event.currentTarget.id
          ].attributes
        ).length
      ).fill(0),
    ];

    let k = defaultAttr[1].length;
    for (let i = 0; i < k; i++) {
      defaultAttr[1][i] =
        this.props.data[store.getState().shop.categoryType.name][
          event.currentTarget.id
        ].attributes[i].items[0].displayValue;
    }
    store.dispatch(
      addToCart(
        this.props.data[store.getState().shop.categoryType.name][
          event.currentTarget.id
        ].name,
        this.props.data[store.getState().shop.categoryType.name],
        defaultAttr
      )
    );
    this.countThePrice();
  };
  render() {
    return this.props.data[store.getState().shop.categoryType.name].map(
      ({ name, prices, gallery }, key) =>
        this.props.data[store.getState().shop.categoryType.name][key]
          .inStock === true ? (
          <Link
            to={`/ItemSite/${key}`}
            key={key}
            style={{ textDecoration: "none" }}
          >
            <div
              id={key}
              key={name}
              className="itemI"
              onClick={this.CurrentItem}
            >
              <div
                className="imageContainer"
                onClick={(e) => {
                  if (e.target !== e.currentTarget) {
                    e.preventDefault();
                  }
                }}
              >
                {this.props.data[store.getState().shop.categoryType.name][key]
                  .inStock === true ? (
                  <img
                    className="Itemimage"
                    alt="location-reference"
                    src={
                      Object.keys(
                        this.props.data[
                          store.getState().shop.categoryType.name
                        ][key].gallery
                      ).length === 1
                        ? `${gallery}`
                        : `${gallery[0]}`
                    }
                  />
                ) : (
                  <img
                    className="ItemimageFaded"
                    alt="location-reference"
                    src={
                      Object.keys(
                        this.props.data[
                          store.getState().shop.categoryType.name
                        ][key].gallery
                      ).length === 1
                        ? `${gallery}`
                        : `${gallery[0]}`
                    }
                  />
                )}
                {this.props.data[store.getState().shop.categoryType.name][key]
                  .inStock === false ? (
                  <div className="oos">OUT OF STOCK</div>
                ) : (
                  <img
                    className="cartImage"
                    alt="location-reference"
                    src={imageCart}
                    id={key}
                    key={name}
                    onClick={this.GetIdClick}
                  />
                )}
              </div>
              <div className="content">
                <p className="title">{name}</p>
                <p className="price">
                  {
                    prices[store.getState().shop.currentCurrency.id].currency
                      .symbol
                  }
                  {prices[store.getState().shop.currentCurrency.id].amount}{" "}
                </p>
              </div>
            </div>
          </Link>
        ) : (
          <div id={key} key={name} className="itemI" onClick={this.CurrentItem}>
            <div
              className="imageContainer"
              onClick={(e) => {
                if (e.target !== e.currentTarget) {
                  e.preventDefault();
                }
              }}
            >
              {this.props.data[store.getState().shop.categoryType.name][key]
                .inStock === true ? (
                <img
                  className="Itemimage"
                  alt="location-reference"
                  src={
                    Object.keys(
                      this.props.data[store.getState().shop.categoryType.name][
                        key
                      ].gallery
                    ).length === 1
                      ? `${gallery}`
                      : `${gallery[0]}`
                  }
                />
              ) : (
                <img
                  className="ItemimageFaded"
                  alt="location-reference"
                  src={
                    Object.keys(
                      this.props.data[store.getState().shop.categoryType.name][
                        key
                      ].gallery
                    ).length === 1
                      ? `${gallery}`
                      : `${gallery[0]}`
                  }
                />
              )}
              {this.props.data[store.getState().shop.categoryType.name][key]
                .inStock === false ? (
                <div className="oos">OUT OF STOCK</div>
              ) : (
                <img
                  className="cartImage"
                  alt="location-reference"
                  src={imageCart}
                  id={key}
                  key={name}
                  onClick={this.GetIdClick}
                />
              )}
            </div>
            <div className="content">
              <p className="title">{name}</p>
              <p className="price">
                {
                  prices[store.getState().shop.currentCurrency.id].currency
                    .symbol
                }
                {prices[store.getState().shop.currentCurrency.id].amount}{" "}
              </p>
            </div>
          </div>
        )
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (id) => dispatch(addToCart(id)),
    loadCurrentItem: (item) => dispatch(loadCurrentItem(item)),
  };
};
export default connect(null, mapDispatchToProps)(PokemonList);
