import React from "react";

const Photo=({farm,server,id,secret})=> {
  return (
    <li>
    <img src={`https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`} alt="" />
  </li>
  );
}

export default Photo;