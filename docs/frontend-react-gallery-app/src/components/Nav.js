import React from "react";
import { NavLink } from 'react-router-dom';

/**
 * Nav renders the navigation for the default routes available
 * */
const Nav = () => {
    return (
        <nav className="main-nav">
            <ul>
                <li>
                    <NavLink to='/sunsets'>sunsets</NavLink>
                </li>
                <li>
                    <NavLink to='/waterfalls'>waterfalls</NavLink>
                </li>
                <li>
                    <NavLink to='/rainbows'>rainbows</NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Nav;