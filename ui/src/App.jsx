import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import OrderPage from "./pages/OrderPage";
import AdminPage from "./pages/AdminPage";
import "./App.css";

//const API_URL = "http://localhost:3001/api";
//const API_URL = "https://order-app-backend-nq22.onrender.com/api";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);

  // Fetch initial data from backend
  const fetchData = useCallback(async () => {
    try {
      const [menusRes, ordersRes, inventoryRes] = await Promise.all([
        fetch(`${API_URL}/menus`),
        fetch(`${API_URL}/orders`),
        fetch(`${API_URL}/inventory`),
      ]);
      const menusData = await menusRes.json();
      const ordersData = await ordersRes.json();
      const inventoryData = await inventoryRes.json();

      setMenuItems(menusData);
      setOrders(ordersData);
      setInventory(inventoryData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Frontend Logic (Cart)
  const handleAddToCart = (item, selectedOptions) => {
    const optionsPrice = selectedOptions.reduce((total, optionName) => {
      const option = item.options.find((opt) => opt.name === optionName);
      return total + (option ? option.price : 0);
    }, 0);
    const priceWithOption = item.price + optionsPrice;
    const cartId = `${item.id}-${selectedOptions.sort().join("-")}`;

    const existingItem = cartItems.find(
      (cartItem) => cartItem.cartId === cartId
    );
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.cartId === cartId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          ...item,
          cartId,
          options: selectedOptions,
          priceWithOption,
          quantity: 1,
        },
      ]);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.priceWithOption * item.quantity,
    0
  );

  // API Calls (Mutations)
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems, totalPrice }),
      });
      if (response.ok) {
        setCartItems([]);
        alert("주문이 완료되었습니다!");
        fetchData(); // Refetch all data to update UI
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("주문 처리 중 오류가 발생했습니다.");
    }
  };

  const handleUpdateInventory = async (itemId, newStock) => {
    try {
      await fetch(`${API_URL}/inventory/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });
      fetchData(); // Refetch
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`${API_URL}/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchData(); // Refetch
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <OrderPage
                menuItems={menuItems}
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
