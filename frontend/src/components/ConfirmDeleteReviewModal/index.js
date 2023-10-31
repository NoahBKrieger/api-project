import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteReviewThunk } from "../../store/reviewReducer";
import { getSpotReviewsThunk } from "../../store/reviewReducer";
import { getSpotThunk } from "../../store/spotReducer";

function ConfirmDeleteReviewModal({ review, spot }) {

    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const deleteReview = (async () => {

        await dispatch(deleteReviewThunk(Number(review.id)))
            .then(dispatch(getSpotReviewsThunk(spot.id)))
            .then(dispatch(getSpotThunk(spot.id)))
            .then(closeModal())
    })

    return (
        <>
            <h2>Confirm Delete?</h2>
            <div>
                <button onClick={deleteReview}>Confirm</button>
                <button onClick={closeModal}>Cancel</button>
            </div>
        </>
    )

}

export default ConfirmDeleteReviewModal;
