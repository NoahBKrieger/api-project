import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteSpotThunk, fetchUserSpotsThunk } from "../../store/spotReducer";

function ConfirmDeleteSpotModal({ spot }) {

    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const deleteButton = async () => {



        await dispatch(deleteSpotThunk(Number(spot.id)))
        dispatch(fetchUserSpotsThunk())
            .then(closeModal())

    }


    return (
        <>
            <h2>Confirm Delete?</h2>
            <div>
                <button onClick={deleteButton}>Confirm</button>
                <button onClick={closeModal}>Cancel</button>
            </div>
        </>
    )

}

export default ConfirmDeleteSpotModal;
