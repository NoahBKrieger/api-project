
// import SpotDetailsButton from "../SpotDetails";
import { useHistory } from "react-router-dom";
import { useEffect, } from "react";
import { deleteSpotThunk, getSpotThunk, fetchUserSpotsThunk } from "../../store/spotReducer";
import { useDispatch } from "react-redux";
import { getSpotReviewsThunk } from '../../store/reviewReducer'

import './SpotItem.css'



function SpotItem({ spot, user }) {


    const dispatch = useDispatch();

    const history = useHistory()

    let reviewText
    if (spot.avgRating === 'no reviews') {
        reviewText = 'New'
    } else {
        reviewText = `Average Rating: ${spot.avgRating} stars`
    }

    const itemClick = () => {

        dispatch(getSpotThunk(Number(spot.id)))
        dispatch(getSpotReviewsThunk(Number(spot.id)))



        history.push(`/spots/${spot.id}`)





    }

    const deleteButton = () => {

        dispatch(deleteSpotThunk(Number(spot.id)))

    }

    useEffect(() => {
        dispatch(fetchUserSpotsThunk());
    }, [dispatch]);



    return (


        <div className="item-container">
            <div className="item" onClick={itemClick}>

                <img className='preview-image' src='https://images.app.goo.gl/hrxAnjFhyGWnpJHX6' alt={`${spot.name} preview`}></img>
                <p>{`${spot.city}, ${spot.state}`}</p>
                <p>{reviewText}</p>
                <p>{`$${spot.price} night`}</p>
                <span className="tooltip-text">{spot.name}</span>

            </div>
            <div className="buttons">
                {user && <button spot={spot}>Update</button>}
                {user && <button onClick={deleteButton}>Delete Spot</button>}
            </div>
        </div>
        // </Link>
    )
}

export default SpotItem;
