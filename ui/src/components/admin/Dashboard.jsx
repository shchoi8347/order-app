import React, { useMemo } from 'react';

const Dashboard = ({ orders }) => {
  const dashboardStats = useMemo(() => {
    return {
      total: orders.length,
      received: orders.filter(o => o.status === '주문 접수').length,
      inProgress: orders.filter(o => o.status === '제조 중').length,
      completed: orders.filter(o => o.status === '제조 완료').length,
    };
  }, [orders]);

  return (
    <section className="admin-section">
      <h2 className="admin-section-title">관리자 대시보드</h2>
      <div className="dashboard-grid">
        <div className="dashboard-item">
          <h3 className="dashboard-item-title">총 주문</h3>
          <p className="dashboard-item-count">{dashboardStats.total}</p>
        </div>
        <div className="dashboard-item">
          <h3 className="dashboard-item-title">주문 접수</h3>
          <p className="dashboard-item-count">{dashboardStats.received}</p>
        </div>
        <div className="dashboard-item">
          <h3 className="dashboard-item-title">제조 중</h3>
          <p className="dashboard-item-count">{dashboardStats.inProgress}</p>
        </div>
        <div className="dashboard-item">
          <h3 className="dashboard-item-title">제조 완료</h3>
          <p className="dashboard-item-count">{dashboardStats.completed}</p>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

