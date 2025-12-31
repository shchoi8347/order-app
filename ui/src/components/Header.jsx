import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <h1 className="logo">COZY</h1>
      <nav>
        <NavLink to="/" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>주문하기</NavLink>
        <NavLink to="/admin" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>관리자</NavLink>
      </nav>
    </header>
  );
};

export default Header;

