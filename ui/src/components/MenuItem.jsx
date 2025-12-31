import React, { useState } from 'react';

const MenuItem = ({ item, onAddToCart }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionChange = (e) => {
    const optionName = e.target.name;
    if (e.target.checked) {
      setSelectedOptions(prev => [...prev, optionName]);
    } else {
      setSelectedOptions(prev => prev.filter(opt => opt !== optionName));
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart(item, selectedOptions);
    setSelectedOptions([]); // Reset internal state
  };

  return (
    <div className="menu-item-card">
      <img src={item.image_url} alt={item.name} className="item-image" />
      <h3 className="item-name">{item.name}</h3>
      <p className="item-price">{item.price.toLocaleString()}원</p>
      <p className="item-description">{item.description}</p>
      <div className="item-options">
        {item.options.map(option => (
          <div key={option.name}>
            <input
              type="checkbox"
              id={`${item.id}-${option.name}`}
              name={option.name}
              checked={selectedOptions.includes(option.name)} // Controlled component
              onChange={handleOptionChange}
            />
            <label htmlFor={`${item.id}-${option.name}`}>
              {option.name} (+{option.price.toLocaleString()}원)
            </label>
          </div>
        ))}
      </div>
      <button className="btn add-to-cart-btn" onClick={handleAddToCartClick}>담기</button>
    </div>
  );
};

export default MenuItem;

