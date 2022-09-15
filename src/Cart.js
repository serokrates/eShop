import React from "react";
import { useQuery, gql } from '@apollo/client';
import { render } from "@testing-library/react";
import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import { Component,useState,useLayoutEffect } from 'react';
import store from "./Redux/store";
import {loadData,addToCart} from "./Redux/Shopping/shopping-actions"
import imageCart from './imageCart.svg';
import {connect} from 'react-redux';
import {querryAsk} from './App';
import Menu from './Menu';

class Cart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataTo:this.props.data,
      product:store.getState().shop.cart,
      categoryName:'',
      cart:null
    }
  }
   
  componentDidMount() {
    console.log('component mount pokemonlist')

  }

  
  render(){
    console.log('render')
    console.log(this.state.dataTo)
    console.log(this.state.product[0].name)
    return (
        <div className="App">
          {/* <div className="Menu"> 
            {Object.keys(this.dataTo).length ? <Menu data={this.state.categoriesSet} data2={this.props.data}/>:"not loaded Menu" }
          </div> */}
        {
            this.state.product.map(({name, gallery, prices},key) => (
                <div id={key} key={name} className="itemI" >
                {/* {console.log(this.props.data[store.getState().shop.categoryType.name][key].inStock)} */}
                <div className="imageContainer">
                <img className="Itemimage" alt="location-reference" src={Object.keys(this.state.product[key].gallery).length === 1 ? `${gallery}`:`${gallery[1]}`} />
                  <img className="cartImage" alt="location-reference" src= {imageCart} id={key} key={name} />
                </div>
                <div className="content">
                  <p className="title">{name} {this.state.product[key].qty}</p>
                  <p className="price">{ prices[store.getState().shop.currentCurrency.id].currency.symbol}{prices[store.getState().shop.currentCurrency.id].amount} </p>
                </div>
              </div>
            ))
        
        }
        </div>
    );
    
  }
}
const mapStateToProps = state =>({
    cart: state.shop.cart
});

export default connect(mapStateToProps)(Cart)