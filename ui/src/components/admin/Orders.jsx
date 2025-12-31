import React from 'react';

const OrderItem = ({ order, onUpdateOrderStatus }) => {
  const handleStatusChange = () => {
    // Explicitly check the current status and set the next one.
    switch (order.status) {
      case '주문 접수':
        onUpdateOrderStatus(order.id, '제조 중');
        break;
      case '제조 중':
        onUpdateOrderStatus(order.id, '제조 완료');
        break;
      default:
        // Do nothing if status is '제조 완료' or something else.
        return;
    }
  };

  const formattedTimestamp = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(order.timestamp);
  
  const menuSummary = order.items
    .map(item => `${item.name} x ${item.quantity}`)
    .join(', ');

  return (
    <div className="order-list-item">
      <div className="order-details">
        <span className="order-timestamp">{formattedTimestamp}</span>
        <span className="order-menu">{menuSummary}</span>
        <span className="order-price">{order.totalPrice.toLocaleString()}원</span>
      </div>
      <button 
        className="btn order-status-btn" 
        onClick={handleStatusChange}
        disabled={order.status === '제조 완료'}
      >
        {order.status === '주문 접수' && '제조 시작'}
        {order.status === '제조 중' && '제조 중'}
        {order.status === '제조 완료' && '제조 완료'}
      </button>
    </div>
  );
};


const Orders = ({ orders, onUpdateOrderStatus }) => {
  // orders prop is sorted newest-first from App.jsx
  let completedCount = 0;
  const displayOrders = orders.filter(order => {
    if (order.status !== '제조 완료') {
      return true; // Keep all pending orders
    }
    // Keep the 2 most recent completed orders
    if (completedCount < 2) {
      completedCount++;
      return true;
    }
    return false;
  });

  return (
    <section className="admin-section">
      <h2 className="admin-section-title">주문 현황 <small style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>(먼저 들어온 주문이 위에 표시됩니다)</small></h2>
      <div className="order-list">
        {displayOrders.length === 0 ? (
          <p>현재 접수된 주문이 없습니다.</p>
        ) : (
          displayOrders.slice().reverse().map(order => (
            <OrderItem key={order.id} order={order} onUpdateOrderStatus={onUpdateOrderStatus} />
          ))
        )}
      </div>
    </section>
  );
};

export default Orders;

