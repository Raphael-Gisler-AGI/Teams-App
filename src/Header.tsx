import React from "react";
import { Outlet } from "react-router-dom";
import { UserData } from "./Types";

function Header({userData} : {userData: UserData | undefined}) {
  return (
    <main>
      <header>
        <h1>Teams App</h1>
        <div className="userInfo">
          <h2>{userData?.name}</h2>
          <h3>{userData?.username}</h3>
        </div>
      </header>
      <Outlet />
    </main>
  );
}

export default Header;
