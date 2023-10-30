
// import SpotDetailsButton from "../SpotDetails";
import { useHistory } from "react-router-dom";
// import { useEffect, } from "react";
import { getSpotThunk } from "../../store/spotReducer";
import { useDispatch } from "react-redux";
import { getSpotReviewsThunk } from '../../store/reviewReducer'
import OpenModalButton from "../OpenModalButton";

import './SpotItem.css'
import ConfirmDeleteSpotModal from "../ConfirmDeleteModal";




function SpotItem({ spot, user }) {

    const pineapple = "https://i.pinimg.com/originals/58/b3/40/58b340936b2c1ed07bed66c260b00534.png"
    const dispatch = useDispatch();



    const history = useHistory()

    let reviewText
    if (spot.avgRating === 'no reviews') {
        reviewText = false
    } else {
        reviewText = true
    }

    const itemClick = async () => {

        await dispatch(getSpotThunk(Number(spot.id)))
        await dispatch(getSpotReviewsThunk(Number(spot.id)))

            .then(history.push(`/spots/${spot.id}`))
    }

    const updateButton = () => {

        dispatch(getSpotThunk(Number(spot.id)))

        history.push(`/spots/${spot.id}/edit`)
    }

    // const deleteButton = async () => {



    //     await dispatch(deleteSpotThunk(Number(spot.id)))
    //     // history.push('/spots/user')

    // }

    // useEffect(() => {
    //     dispatch(fetchUserSpotsThunk());
    // }, [dispatch]);



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
                {reviewText && spot.avgRating && <div><i class="fa fa-star"></i>{spot.avgRating.toFixed(1)}</div>}
                {!reviewText && <p>New</p>}
                <p>{`$${spot.price} night`}</p>
                <span className="tooltip-text">{spot.name}</span>

            </div>
            <div className="buttons">
                {user && <button onClick={updateButton}>Update Spot</button>}
                {user && <OpenModalButton

                    buttonText='Delete Spot'
                    modalComponent={<ConfirmDeleteSpotModal spot={spot} />}>
                </OpenModalButton>}
            </div>
        </div>
        // </Link>
    )
}

export default SpotItem;
