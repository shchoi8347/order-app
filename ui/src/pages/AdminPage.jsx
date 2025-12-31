import React from 'react';
import Dashboard from '../components/admin/Dashboard';
import Inventory from '../components/admin/Inventory';
import Orders from '../components/admin/Orders';

const AdminPage = ({ orders, inventory, onUpdateInventory, onUpdateOrderStatus }) => {
  return (
    <div className="admin-page">
      <Dashboard orders={orders} />
      <Inventory inventory={inventory} onUpdateInventory={onUpdateInventory} />
      <Orders orders={orders} onUpdateOrderStatus={onUpdateOrderStatus} />
    </div>
  );
};

export default AdminPage;
