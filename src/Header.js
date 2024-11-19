import React from "react";
import { Outlet } from "react-router-dom";

function Header() {
  return (
    <main>
      <header>
        <h1>Teams App</h1>
      </header>
      <Outlet />
    </main>
  );
}

export default Header;
