import React, { useState, useMemo } from "react";
import Header from "./components/Header";
import MenuList from "./components/MenuList";
import Cart from "./components/Cart";
import "./App.css";

const mockMenuItems = [
  {
    id: 1,
    name: "아메리카노 (ICE)",
    price: 4000,
    description: "시원하고 깔끔한 맛의 기본 커피",
    options: [
      { name: "샷 추가", price: 500 },
      { name: "시럽 추가", price: 0 },
    ],
  },
  {
    id: 2,
    name: "아메리카노 (HOT)",
    price: 4000,
    description: "따뜻하고 부드러운 맛의 기본 커피",
    options: [
      { name: "샷 추가", price: 500 },
      { name: "시럽 추가", price: 0 },
    ],
  },
  {
    id: 3,
    name: "카페라떼",
    price: 5000,
    description: "고소한 우유와 에스프레소의 조화",
    options: [
      { name: "샷 추가", price: 500 },
      { name: "시럽 추가", price: 0 },
    ],
  },
  {
    id: 4,
    name: "바닐라 라떼",
    price: 5500,
    description: "달콤한 바닐라 시럽이 들어간 라떼",
    options: [
      { name: "샷 추가", price: 500 },
      { name: "휘핑 추가", price: 300 },
    ],
  },
];

function App() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (item, selectedOptions) => {
    // Calculate price with options
    const optionsPrice = selectedOptions.reduce((total, optionName) => {
      const option = item.options.find((opt) => opt.name === optionName);
      return total + (option ? option.price : 0);
    }, 0);
    const priceWithOption = item.price + optionsPrice;

    // Create a unique key for the item with its specific options
    const cartId = `${item.id}-${selectedOptions.sort().join("-")}`;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.cartId === cartId
      );

      if (existingItem) {
        // Increment quantity if item with same options already in cart
        return prevItems.map((cartItem) =>
          cartItem.cartId === cartId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Add new item to cart
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

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.priceWithOption * item.quantity,
      0
    );
  }, [cartItems]);

  return (
    <div className="app-container">
      <Header />
      <main>
        <MenuList menuItems={mockMenuItems} onAddToCart={handleAddToCart} />
        <Cart cartItems={cartItems} totalPrice={totalPrice} />
      </main>
    </div>
  );
}

export default App;
