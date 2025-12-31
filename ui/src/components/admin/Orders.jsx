import React from 'react';

const OrderItem = ({ order, onUpdateOrderStatus }) => {
  const handleStatusChange = () => {
    if (order.status === '주문 접수') {
      onUpdateOrderStatus(order.id, '제조 중');
    } else if (order.status === '제조 중') {
      onUpdateOrderStatus(order.id, '제조 완료');
    }
  };

  const formattedTimestamp = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
        {order.status === '제조 중' && '제조 완료'}
        {order.status === '제조 완료' && '완료'}
      </button>
    </div>
  );
};


const Orders = ({ orders, onUpdateOrderStatus }) => {
  return (
    <section className="admin-section">
      <h2 className="admin-section-title">주문 현황</h2>
      <div className="order-list">
        {orders.length === 0 ? (
          <p>현재 접수된 주문이 없습니다.</p>
        ) : (
          orders.map(order => (
            <OrderItem key={order.id} order={order} onUpdateOrderStatus={onUpdateOrderStatus} />
          ))
        )}
      </div>
    </section>
  );
};

export default Orders;

