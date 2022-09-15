import React from "react";
import { gql } from "@apollo/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Component } from "react";
import store from "./Redux/store";
import { addToCart, sumPrice } from "./Redux/Shopping/shopping-actions";
import { connect } from "react-redux";
import Menu from "./Menu";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

class ItemSite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: store.getState().shop.currentItem[0].gallery[0],
      attrbtsSet: 0,
      currentItemData: store.getState().shop.currentItem,
      stringHTML: store.getState().shop.currentItem[0].description,
      attrClicked: [],
      dataTo: [],
      product: store.getState().shop.cart,
      cart: null,
      AllProducts: [],
    };
    this.querryAsk = this.querryAsk.bind(this);
  }
  changeImg = (e) => {
    let imgSrc = e;
    this.setState({
      img: imgSrc,
    });
  };
  initializeAttrArr = () => {
    const attrArr2 = Array(
      Object.keys(store.getState().shop.currentItem[0].attributes).length
    ).fill(0);
    let k = Array(
      Object.keys(store.getState().shop.currentItem[0].attributes).length
    );
    for (let i = 0; i < k.length; i++) {
      attrArr2[i] =
        this.state.currentItemData[0].attributes[i].items[0].displayValue;
    }
    this.setState({
      attrClicked: attrArr2,
    });
  };
  createAtrClick = (value, attr) => {
    let attrArr = [...this.state.attrClicked];

    attrArr[attr] = value;

    this.setState({
      attrClicked: attrArr,
    });
  };
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
    });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.querryAsk();
    this.initializeAttrArr();
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
  addToCartFunction = (event) => {
    store.dispatch(
      addToCart(
        event.currentTarget.id,
        this.state.AllProducts[store.getState().shop.categoryType.name],
        [0, this.state.attrClicked]
      )
    );
    this.countThePrice();
  };
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <div className="Menu" onClick={() => this.querryAsk()}>
            {Object.keys(this.state.dataTo).length ? (
              <Menu data2={this.state.AllProducts} />
            ) : (
              "not loaded Menu"
            )}
          </div>
          <div className="itemContainerIS">
            <img
              className="ItemimageItemSite"
              alt="location-reference"
              src={`${this.state.img}`}
            />
            <div className="contentIS">
              <div className="textCart">
                <div className="namePriceCart">
                  <div className="attributeTitleItemSite">
                    {this.state.currentItemData[0].name}
                  </div>
                </div>
                {this.state.currentItemData[0].attributes.map(
                  ({ id, name, items }, key2) => (
                    <div className="attributesItemSite" key={key2}>
                      <div className="textItemSite">{name}:</div>
                      {this.state.currentItemData[0].attributes[key2].type ===
                      "swatch" ? (
                        <div className="attributesVariantsItemSite">
                          {this.state.currentItemData[0].attributes[
                            key2
                          ].items.map(({ displayValue, value }, key3) =>
                            this.state.attrClicked[key2] ===
                            this.state.currentItemData[0].attributes[key2]
                              .items[key3].displayValue ? (
                              this.state.currentItemData[0].attributes[key2]
                                .items[key3].displayValue === "White" ? (
                                <div className="borderBoxItemSite">
                                  <div
                                    key={key3}
                                    typeof="text"
                                    className="attributeValuesColorsItemSite"
                                    style={{
                                      backgroundColor: value,
                                      width: "32px",
                                      height: "32px",
                                    }}
                                    onClick={() =>
                                      this.createAtrClick(
                                        this.state.currentItemData[0]
                                          .attributes[key2].items[key3]
                                          .displayValue,
                                        key2
                                      )
                                    }
                                  ></div>
                                </div>
                              ) : (
                                <div className="borderBoxItemSite">
                                  <div
                                    key={key3}
                                    typeof="text"
                                    className="attributeValuesColorsItemSite"
                                    style={{ backgroundColor: value }}
                                    onClick={() =>
                                      this.createAtrClick(
                                        this.state.currentItemData[0]
                                          .attributes[key2].items[key3]
                                          .displayValue,
                                        key2
                                      )
                                    }
                                  ></div>
                                </div>
                              )
                            ) : this.state.currentItemData[0].attributes[key2]
                                .items[key3].displayValue === "White" ? (
                              <div
                                key={key3}
                                typeof="text"
                                className="attributeValuesColorsItemSite"
                                style={{
                                  backgroundColor: value,
                                  border: "0.5px solid black",
                                  width: "32px",
                                  height: "32px",
                                }}
                                onClick={() =>
                                  this.createAtrClick(
                                    this.state.currentItemData[0].attributes[
                                      key2
                                    ].items[key3].displayValue,
                                    key2
                                  )
                                }
                              ></div>
                            ) : (
                              <div
                                key={key3}
                                typeof="text"
                                className="attributeValuesColorsItemSite"
                                style={{ backgroundColor: value }}
                                onClick={() =>
                                  this.createAtrClick(
                                    this.state.currentItemData[0].attributes[
                                      key2
                                    ].items[key3].displayValue,
                                    key2
                                  )
                                }
                              ></div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="attributesVariants">
                          {this.state.currentItemData[0].attributes[
                            key2
                          ].items.map(({ displayValue }, key3) =>
                            this.state.attrClicked[key2] ===
                            this.state.currentItemData[0].attributes[key2]
                              .items[key3].displayValue ? (
                              <div
                                key={key3}
                                typeof="text"
                                className="attributeValuesItemsite"
                                style={{
                                  backgroundColor: "black",
                                  color: "white",
                                }}
                                onClick={() =>
                                  this.createAtrClick(
                                    this.state.currentItemData[0].attributes[
                                      key2
                                    ].items[key3].displayValue,
                                    key2
                                  )
                                }
                              >
                                {displayValue}
                              </div>
                            ) : (
                              <div
                                key={key3}
                                typeof="text"
                                className="attributeValuesItemsite"
                                onClick={() =>
                                  this.createAtrClick(
                                    this.state.currentItemData[0].attributes[
                                      key2
                                    ].items[key3].displayValue,
                                    key2
                                  )
                                }
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
              <div className="textItemSite">Price: </div>
              <div className="price">
                {
                  this.state.currentItemData[0].prices[
                    store.getState().shop.currentCurrency.id
                  ].currency.symbol
                }
                {
                  this.state.currentItemData[0].prices[
                    store.getState().shop.currentCurrency.id
                  ].amount
                }
              </div>
              <button
                className="buy"
                id={this.state.currentItemData[0].name}
                onClick={this.addToCartFunction}
              >
                <div className="atc">ADD TO CART</div>
              </button>
              <div
                className="description"
                dangerouslySetInnerHTML={{ __html: this.state.stringHTML }}
              ></div>
            </div>
          </div>
        </div>
        <div className="images">
          {Object.keys(this.state.currentItemData[0].gallery).length === 1 ? (
            <></>
          ) : (
            this.state.currentItemData[0].gallery.map((img) => (
              <img
                onClick={() => this.changeImg(img)}
                id={`${img}`}
                key={img}
                className="smallImg"
                alt="location-reference"
                src={`${img}`}
              />
            ))
          )}
        </div>
      </ApolloProvider>
    );
  }
}
const mapStateToProps = (state) => ({
  cart: state.shop.cart,
});

export default connect(mapStateToProps)(ItemSite);
