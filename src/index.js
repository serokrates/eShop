import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ItemSite from "./ItemSite";
import Menu from "./Menu";
import CartSite from "./cartSite";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<App />} />
          <Route exact path="/itemSite/:id" element={<ItemSite />} />
          <Route exact path="Menu" element={<Menu />} />
          <Route exact path="cartSite" element={<CartSite />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);
reportWebVitals();
