import React from 'react';
import MenuList from '../components/MenuList';
import Cart from '../components/Cart';

const OrderPage = ({ menuItems, cartItems, onAddToCart, totalPrice, onPlaceOrder }) => {
  return (
    <main>
      <MenuList menuItems={menuItems} onAddToCart={onAddToCart} />
      <Cart cartItems={cartItems} totalPrice={totalPrice} onPlaceOrder={onPlaceOrder} />
    </main>
  );
};

export default OrderPage;

