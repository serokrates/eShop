import * as actionTypes from "./shopping-types";

export const addToCart = (itemID, itemlist, attributesValues) => {
  return {
    type: actionTypes.ADD_TO_CART,
    payload: {
      name: itemID,
      ITEMLIST: itemlist,
      attributesValues: attributesValues,
    },
  };
};

export const removeFromCart = (itemID, attributesValues) => {
  return {
    type: actionTypes.REMOVE_FROM_CART,
    payload: {
      name: itemID,
      attributesValues: attributesValues,
    },
  };
};

export const adjustQty = (
  itemID,
  value,
  newValue,
  attributesValues,
  itemCount2
) => {
  value < newValue
    ? (itemCount2 = itemCount2 + 1)
    : (itemCount2 = itemCount2 - 1);
  return {
    type: actionTypes.ADJUST_QTY,
    payload: {
      name: itemID,
      qty: value,
      newQty: newValue,
      attributesValues: attributesValues,
      itemCount2: itemCount2,
    },
  };
};
export const categoryType = (categoryName) => {
  return {
    type: actionTypes.CATEGORY_TYPE,
    payload: {
      name: categoryName,
    },
  };
};
export const sumPrice = (sumPricee) => {
  return {
    type: actionTypes.SUM_PRICE,
    payload: {
      sumPricee: sumPricee,
    },
  };
};
export const currencyType = (id, label, symbol) => {
  return {
    type: actionTypes.CURRENCY_TYPE,
    payload: {
      id: id,
      label: label,
      symbol: symbol,
    },
  };
};
export const removeCurrentItem = (itemID) => {
  return {
    type: actionTypes.REMOVE_CURRENT_ITEM,
    payload: {
      id: itemID,
    },
  };
};
export const loadCurrentItem = (itemID, itemlist) => {
  return {
    type: actionTypes.LOAD_CURRENT_ITEM,
    payload: {
      name: itemID,
      ITEMLIST: itemlist,
    },
  };
};
