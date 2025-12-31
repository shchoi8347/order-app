import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import OrderPage from "./pages/OrderPage";
import AdminPage from "./pages/AdminPage";
import "./App.css";

import { mockMenuItems, initialInventory } from "./data";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState(initialInventory);

  const handleAddToCart = (item, selectedOptions) => {
    const optionsPrice = selectedOptions.reduce((total, optionName) => {
      const option = item.options.find((opt) => opt.name === optionName);
      return total + (option ? option.price : 0);
    }, 0);
    const priceWithOption = item.price + optionsPrice;
    const cartId = `${item.id}-${selectedOptions.sort().join("-")}`;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.cartId === cartId
      );
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.cartId === cartId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [
          ...prevItems,
          {
            ...item,
            cartId,
            options: selectedOptions,
            priceWithOption,
            quantity: 1,
          },
        ];
      }
    });
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    const newOrder = {
      id: Date.now(),
      timestamp: new Date(),
      items: cartItems,
      totalPrice: totalPrice,
      status: "주문 접수",
    };
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    setCartItems([]); // Clear cart after placing order
    alert("주문이 완료되었습니다!");
  };

  const handleUpdateInventory = (itemId, newStock) => {
    setInventory((prevInventory) =>
      prevInventory.map((item) =>
        item.id === itemId ? { ...item, stock: Math.max(0, newStock) } : item
      )
    );
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const orderToUpdate = orders.find((o) => o.id === orderId);

    // If the order is being completed, update the inventory first.
    if (
      orderToUpdate &&
      newStatus === "제조 완료" &&
      orderToUpdate.status !== "제조 완료"
    ) {
      setInventory((prevInventory) => {
        const inventoryUpdates = {};
        orderToUpdate.items.forEach((item) => {
          inventoryUpdates[item.id] =
            (inventoryUpdates[item.id] || 0) + item.quantity;
        });

        return prevInventory.map((inventoryItem) => {
          if (inventoryUpdates[inventoryItem.id]) {
            return {
              ...inventoryItem,
              stock: Math.max(
                0,
                inventoryItem.stock - inventoryUpdates[inventoryItem.id]
              ),
            };
          }
          return inventoryItem;
        });
      });
    }

    // Then, update the order status.
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.priceWithOption * item.quantity,
      0
    );
  }, [cartItems]);

  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <OrderPage
                menuItems={mockMenuItems}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                totalPrice={totalPrice}
                onPlaceOrder={handlePlaceOrder}
              />
            }
          />
          <Route
            path="/admin"
            element={
              <AdminPage
                orders={orders}
                inventory={inventory}
                onUpdateInventory={handleUpdateInventory}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
