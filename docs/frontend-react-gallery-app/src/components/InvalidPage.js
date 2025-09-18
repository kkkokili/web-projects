import React from "react";
import { NavLink } from "react-router-dom";

/**
 * InvalidPage renders a 404 page
 * */
const InvalidPage = () => {
    return(
        <ul>
            <li className="not-found">
                <h3>This page does not exist</h3>
                <p>The page you are trying to access is invalid. Please go to the homepage</p>
                <NavLink to='/'>Go to Homepage</NavLink>
            </li>
        </ul>
    );
}

export default InvalidPage;