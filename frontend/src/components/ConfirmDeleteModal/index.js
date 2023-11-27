import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteSpotThunk, fetchUserSpotsThunk } from "../../store/spotReducer";

import './ConfirmDeleteModal.css'

function ConfirmDeleteSpotModal({ spot }) {

    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const deleteButton = async () => {

        await dispatch(deleteSpotThunk(Number(spot.id)))
        dispatch(fetchUserSpotsThunk())
            .then(closeModal())

    }


    return (
        <div className="delete-spot-modal">
            <h2>Confirm Delete</h2>
            <h3>Are you sure you want to remove this spot?</h3>
            <div>
                <button className="delete-spot-confirm" onClick={deleteButton}>Yes (Delete Spot)</button>
                <button className='delete-spot-cancel' onClick={closeModal}>No (Keep Spot)</button>
            </div>
        </div>
    )

}

export default ConfirmDeleteSpotModal;
