import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteReviewThunk } from "../../store/reviewReducer";
import { getSpotReviewsThunk } from "../../store/reviewReducer";
import { getSpotThunk } from "../../store/spotReducer";

import '../ConfirmDeleteModal/ConfirmDeleteModal.css'

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
        <div className="delete-spot-modal">
            <h2>Confirm Delete</h2>
            <h3>Are you sure you want to delete this review?</h3>
            <div>
                <button className='delete-spot-confirm' onClick={deleteReview}>Yes (Delete Review)</button>
                <button className='delete-spot-cancel' onClick={closeModal}>No (Keep Review)</button>
            </div>
        </div>
    )

}

export default ConfirmDeleteReviewModal;
