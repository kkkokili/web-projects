import React from "react";
//Component files
import Photo from './Photo';
import NotFound from './NotFound';

/**
 * @param props
 * PhotoContainer renders the images
 * */
const PhotoContainer = props => {
    const photos = props.data; //images
    let pictures;

    if (photos.length === 0 && props.loading) {
        pictures = <li className="not-found">
                        <p>Loading pictures ......</p>
                   </li>
    } else if (photos.length > 0) {
        pictures = photos.map(picture => //mapping the images to the Photo component
            {
                return <Photo
                        farm={picture.farm}
                        id={picture.id}
                        key={picture.id}
                        server={picture.server}
                        secret={picture.secret}
                        title={picture.title}
                    />
            }
        );
    } else {
        pictures = <NotFound />
    }
    return (
        <div className="photo-container">
            <h2>{ props.query }</h2>
            <ul>
                { pictures }
            </ul>
        </div>
    );
}

export default PhotoContainer;