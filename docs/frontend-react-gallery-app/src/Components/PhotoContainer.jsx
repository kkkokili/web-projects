import React, {useState, useEffect} from "react";
import Photo from "./Photo";
import axios from "axios";
import {APIKey} from "../config.js";
import Loader from 'react-loader-spinner';
import NoResults from "./NoResults";


const PhotoContainer=({keyWord})=> {

  const [collection, updateCollection]=useState(['']);
  const [loading, updateState]=useState(true);

 
  const photos=(topic)=> {
    updateState(true)
  
    axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${APIKey}&tags=${topic}&per_page=24&format=json&nojsoncallback=1`).then(response=>Promise.all(response.data.photos.photo))
    .then(allData => {
      updateCollection(allData);
      updateState(false)

    
    })
    .catch(error => {
      console.log('Error fetching and parsing data', error);
    });
    }
    
   useEffect(()=> {photos(keyWord)}, [keyWord]) 

  return(
      (collection.length===0)? <NoResults /> : (
        
        <div className="photo-container">
          <h2>{keyWord}</h2>
          {
            loading ? (
            <Loader type="ThreeDots" color="#438bbd" height="100" width="100" />
            ) : (
              <ul>
                {
                collection.map(item=> 
                <Photo key={item.id} farm={item.farm} server={item.server} id={item.id} secret={item.secret} 
                />)
                } 
              </ul>)}
              
        </div>)

      )
      
 
}

export default PhotoContainer;