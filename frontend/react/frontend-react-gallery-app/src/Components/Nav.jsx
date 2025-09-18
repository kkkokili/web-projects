import React from "react";
import {NavLink} from "react-router-dom";

const Nav=()=> {
  console.log("nav rerender");
  return(
    <nav className="main-nav">
    <ul>
      <li><NavLink to='/waterfall'>Waterfall</NavLink></li>
      <li><NavLink to='/skies'>Skies</NavLink></li>
      <li><NavLink to='/sea'>Sea</NavLink></li>
    </ul>
  </nav>
  );
}

export default React.memo(Nav);