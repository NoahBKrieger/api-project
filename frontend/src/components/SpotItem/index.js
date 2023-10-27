
import SpotDetailsButton from "../SpotDetails";
import { Link, useHistory } from "react-router-dom";
import { useEffect, useRef } from "react";
import { deleteSpotThunk, getSpotThunk, fetchUserSpotsThunk } from "../../store/spotReducer";
import { useDispatch } from "react-redux";
import { getSpotReviewsThunk } from '../../store/reviewReducer'

import './SpotItem.css'



function SpotItem({ spot, user }) {


    const dispatch = useDispatch();
    const Ref = useRef();
    const history = useHistory()

    let reviewText
    if (spot.avgRating === 'no reviews') {
        reviewText = 'New'
    } else {
        reviewText = `Average Rating: ${spot.avgRating} stars`
    }

    const itemClick = (e) => {

        dispatch(getSpotThunk(Number(spot.id)))
        dispatch(getSpotReviewsThunk(Number(spot.id)))

        if (!Ref.current.contains(e.target)) {

            history.push(`/spots/${spot.id}`)

        }

        /// how can i do this?

    }

    const deleteButton = () => {

        dispatch(deleteSpotThunk(Number(spot.id)))

    }

    useEffect(() => {
        dispatch(fetchUserSpotsThunk());
    }, [dispatch]);



    return (
        // <Link to={`/spots/${spot.id}`}>
        <div className="item" onClick={itemClick}>

            <img className='preview-image' href='https://images.app.goo.gl/hrxAnjFhyGWnpJHX6' alt={`${spot.name} preview`}></img>
            <p>{`${spot.city}, ${spot.state}`}</p>
            <p>{reviewText}</p>
            <p>{`$${spot.price} night`}</p>
            <span className="tooltip-text">{spot.name}</span>
            <SpotDetailsButton spot={spot} />
            {user && <button ref={Ref} onClick={deleteButton}>delete this spot</button>}

        </div>
        // </Link>
    )
}

export default SpotItem;
