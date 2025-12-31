import React from 'react';

const InventoryItem = ({ item, onUpdateInventory }) => {
  const getStatus = () => {
    if (item.stock === 0) return { className: 'soldout', text: '품절' };
    if (item.stock < 5) return { className: 'warning', text: '주의' };
    return { className: 'normal', text: '정상' };
  };

  const status = getStatus();

  return (
    <div className="inventory-item">
      <h3 className="inventory-item-name">{item.name}</h3>
      <p className="inventory-item-stock">{item.stock}개</p>
      <span className={`stock-status ${status.className}`}>{status.text}</span>
      <div className="stock-controls">
        <button className="stock-btn" onClick={() => onUpdateInventory(item.id, item.stock + 1)}>+</button>
        <button className="stock-btn" onClick={() => onUpdateInventory(item.id, item.stock - 1)}>-</button>
      </div>
    </div>
  );
};

const Inventory = ({ inventory, onUpdateInventory }) => {
  return (
    <section className="admin-section">
      <h2 className="admin-section-title">재고 현황</h2>
      <div className="inventory-grid">
        {inventory.map(item => (
          <InventoryItem key={item.id} item={item} onUpdateInventory={onUpdateInventory} />
        ))}
      </div>
    </section>
  );
};

export default Inventory;

