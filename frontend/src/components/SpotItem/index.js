
import SpotDetailsButton from "../SpotDetails";

import './SpotItem.css'

function SpotItem({ spot }) {


    return (
        <div className="item">
            {/* <h2>{spot.name}</h2> */}
            <img className='preview-image' src='' alt={`${spot.name} preview`}></img>
            <p>{`${spot.city}, ${spot.state}`}</p>
            <p>Average Rating: {spot.avgRating}</p>
            <p>{`$${spot.price} night`}</p>
            <SpotDetailsButton spot={spot} />

        </div>
    )
}

export default SpotItem;
