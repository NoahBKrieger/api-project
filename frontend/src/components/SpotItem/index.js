
import SpotDetailsButton from "../SpotDetails";

import './SpotItem.css'

function SpotItem({ spot }) {


    return (
        <div className="item">

            <img className='preview-image' href='https://images.app.goo.gl/hrxAnjFhyGWnpJHX6' alt={`${spot.name} preview`}></img>
            <p>{`${spot.city}, ${spot.state}`}</p>
            <p>Average Rating: {spot.avgRating}</p>
            <p>{`$${spot.price} per night`}</p>
            <span className="tooltip-text">{spot.name}</span>
            <SpotDetailsButton spot={spot} />

        </div>
    )
}

export default SpotItem;
