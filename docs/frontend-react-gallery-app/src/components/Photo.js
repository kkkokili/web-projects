import React from "react";

/**
 * @param props
 * Photo renders a single image
 * */
const Photo = props => {
    //passing the necessary info from props to the flickr picture rendering link
    const source = `https://farm${props.farm}.staticflickr.com/${props.server}/${props.id}_${props.secret}.jpg`;
    return (
        <li>
            <img src={ source } alt={ props.title } />
        </li>
    );
}

export default Photo;