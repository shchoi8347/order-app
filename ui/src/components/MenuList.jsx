import React from 'react';
import MenuItem from './MenuItem';

const MenuList = ({ menuItems, onAddToCart }) => {
  return (
    <section className="menu-list-section">
      <div className="menu-list-grid">
        {menuItems.map(item => (
          <MenuItem key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
};

export default MenuList;

