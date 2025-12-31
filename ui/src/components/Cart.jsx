import React from 'react';

const Cart = ({ cartItems, totalPrice, onPlaceOrder }) => {
  return (
    <section className="cart-section">
      <h2 className="cart-title">장바구니</h2>
      <div className="cart-body">
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p>장바구니가 비어있습니다.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.cartId} className="cart-item">
                <span className="cart-item-details">
                  {item.name} {item.options.length > 0 && `(${item.options.join(', ')})`} x {item.quantity}
                </span>
                <span className="cart-item-price">{(item.priceWithOption * item.quantity).toLocaleString()}원</span>
              </div>
            ))
          )}
        </div>
        <div className="cart-summary-wrapper">
          <div className="cart-summary">
            <span className="total-price-label">총 금액</span>
            <span className="total-price-value">{totalPrice.toLocaleString()}원</span>
          </div>
          <button 
            className="btn order-btn" 
            disabled={cartItems.length === 0}
            onClick={onPlaceOrder}
          >
            주문하기
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cart;

