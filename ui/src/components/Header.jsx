import React from 'react';

const Header = () => {
  return (
    <header className="app-header">
      <h1 className="logo">COZY</h1>
      <nav>
        <a href="#" className="nav-link active">주문하기</a>
        <a href="#" className="nav-link">관리자</a>
      </nav>
    </header>
  );
};

export default Header;

