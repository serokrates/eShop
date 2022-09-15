import * as actionTypes from "./shopping-types";

const INITIAL_STATE = {
  products: [], //{id, title,descr,price,img}
  cart: [], //{id, title,descr,price,img, quantity}
  currentItem: [],
  itemCount: 0,
  categoryType: { name: "all" },
  currentCurrency: { id: 0, label: "USD", symbol: "$" },
  firstTime: 0,
  sumPrice: 0,
};

const shopReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART:
      const item = action.payload.ITEMLIST.find(
        (prod) => prod.name === action.payload.name
      );

      // check if item is in cart already
      const inCart = state.cart.find((item) =>
        item.name === action.payload.name ? true : false
      );
      const inCartattributeValues = state.cart.find((item) =>
        JSON.stringify(item.attrValues) ===
        JSON.stringify(action.payload.attributesValues)
          ? true
          : false
      );

      return {
        // we spread the state in whichc we have a cart,
        ...state,
        itemCount: state.itemCount + 1,
        cart:
          inCart && inCartattributeValues
            ? // then we check if "payloaded" item is in cart already,
              state.cart.map((item) =>
                JSON.stringify(item.attrValues) + JSON.stringify(item.name) ===
                JSON.stringify(action.payload.attributesValues) +
                  JSON.stringify(action.payload.name)
                  ? { ...item, qty: item.qty + 1 }
                  : item
              )
            : // if not, we add this "payloaded" item to cart
              [
                ...state.cart,
                {
                  ...item,
                  qty: 1,
                  attrValues: action.payload.attributesValues,
                },
              ],
      };
    case actionTypes.LOAD_CURRENT_ITEM:
      const item2 = action.payload.ITEMLIST.find(
        (prod) => prod.name === action.payload.name
      );
      const array = state.currentItem.flat();
      const empty = array.length;
      const bool = empty === 0 ? true : false;

      return {
        ...state,
        firstTime: state.firstTime + 1,
        currentItem: bool
          ? item2.name === action.payload.name
            ? [...state.currentItem, { ...item2, qty: 1 }]
            : item2
          : console.log(item2),
      };
    case actionTypes.REMOVE_CURRENT_ITEM:
      return {
        ...state,
        firstTime: state.firstTime - 1,
        currentItem: [
          ...state.currentItem.splice(0, action.payload),
          ...state.currentItem.splice(1),
        ],
      };
    case actionTypes.REMOVE_FROM_CART:
      return {
        ...state,
        itemCount: state.itemCount - 1,
        cart: state.cart.filter(
          (item) =>
            JSON.stringify(item.attrValues) + JSON.stringify(item.name) !==
            JSON.stringify(action.payload.attributesValues) +
              JSON.stringify(action.payload.name)
        ),
      };
    case actionTypes.ADJUST_QTY:
      return {
        ...state,
        itemCount: action.payload.itemCount2,
        cart: state.cart.map((item) =>
          JSON.stringify(item.attrValues) + JSON.stringify(item.name) ===
          JSON.stringify(action.payload.attributesValues) +
            JSON.stringify(action.payload.name)
            ? { ...item, qty: action.payload.newQty }
            : item
        ),
      };

    case actionTypes.CATEGORY_TYPE:
      return {
        ...state,
        categoryType: action.payload,
      };
    case actionTypes.CURRENCY_TYPE:
      return {
        ...state,
        currentCurrency: {
          id: action.payload.id,
          label: action.payload.label,
          symbol: action.payload.symbol,
        },
      };
    case actionTypes.SUM_PRICE:
      return {
        ...state,

        sumPrice: action.payload.sumPricee,
      };
    default:
      return state;
  }
};

export default shopReducer;
