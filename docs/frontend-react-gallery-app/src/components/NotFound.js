import React from "react";

/**
 * NotFound renders a empty search result
 * */
const NotFound = () => {
    return (
        <li className="not-found">
            <h3>No Results Found</h3>
            <p>Your search does not return any results. Please try again.</p>
        </li>
    );
}

export default NotFound;