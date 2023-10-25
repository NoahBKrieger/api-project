
import SpotDetailsButton from "../SpotDetails";
import { Link } from "react-router-dom";
import { getSpotThunk } from "../../store/spotReducer";
import { useDispatch } from "react-redux";

import './SpotItem.css'



function SpotItem({ spot }) {


    const dispatch = useDispatch();


    let reviewText
    if (spot.avgRating === 'no reviews') {
        reviewText = 'New'
    } else {
        reviewText = `Average Rating: ${spot.avgRating} stars`
    }

    const onClick = () => {

        dispatch(getSpotThunk(Number(spot.id)))

    }

    return (
        <Link to={`spots/${spot.id}`}>
            <div className="item" onClick={onClick}>

                <img className='preview-image' href='https://images.app.goo.gl/hrxAnjFhyGWnpJHX6' alt={`${spot.name} preview`}></img>
                <p>{`${spot.city}, ${spot.state}`}</p>
                <p>{reviewText}</p>
                <p>{`$${spot.price} night`}</p>
                <span className="tooltip-text">{spot.name}</span>
                <SpotDetailsButton spot={spot} />

            </div>
        </Link>
    )
}

export default SpotItem;
