
// import SpotDetailsButton from "../SpotDetails";
import { useHistory } from "react-router-dom";
import { useEffect, } from "react";
import { deleteSpotThunk, getSpotThunk, fetchUserSpotsThunk } from "../../store/spotReducer";
import { useDispatch } from "react-redux";
import { getSpotReviewsThunk } from '../../store/reviewReducer'

import './SpotItem.css'




function SpotItem({ spot, user }) {

    const pineapple = "https://i.pinimg.com/originals/58/b3/40/58b340936b2c1ed07bed66c260b00534.png"
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

    const updateButton = () => {

        dispatch(getSpotThunk(Number(spot.id)))

        history.push(`/spots/${spot.id}/edit`)
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

                <img
                    className='preview-image'
                    src={pineapple}
                    alt={`${spot.name} preview`}
                    style={{ width: 300 + 'px', height: 200 + 'px' }}>
                </img>
                <p>{`${spot.city}, ${spot.state}`}</p>
                <p>{reviewText}</p>
                <p>{`$${spot.price} night`}</p>
                <span className="tooltip-text">{spot.name}</span>

            </div>
            <div className="buttons">
                {user && <button onClick={updateButton} spot={spot}>Update</button>}
                {user && <button onClick={deleteButton}>Delete Spot</button>}
            </div>
        </div>
        // </Link>
    )
}

export default SpotItem;
