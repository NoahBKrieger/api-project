
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
// import { useHistory } from "react-router-dom";
import { addReviewThunk } from "../../store/reviewReducer";
import { useModal } from "../../context/Modal";
import './ReviewForm.css'


import '../SpotForm/SpotForm.css'
import { getSpotThunk } from "../../store/spotReducer";


function ReviewForm() {



    const dispatch = useDispatch();

    const spot = useSelector(state => state.spots.currSpot);

    const { closeModal } = useModal()


    const [reviewText, setReviewText] = useState('')
    const [stars, setStars] = useState(0)
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newReview = {}

        newReview.review = reviewText
        newReview.stars = Number(stars)

        console.log('newreview----', newReview)
        setErrors({})

        let newReview2 = dispatch(addReviewThunk(Number(spot.id), newReview))
            .then(() => {

                if (!(newReview2.errors)) {
                    console.log('success')
                    dispatch(getSpotThunk(spot.id))
                    closeModal()
                }
            })

            .catch(async (res) => {

                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                    console.log('errs---', data.errors)
                }
            })
    }

    return (
        <div className="review-form-div">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Add a Review to {spot.name}</h1>

                <label> Review Text
                    <input onChange={(e) => setReviewText(e.target.value)}></input>
                </label>
                {errors.review && <p>{errors.review}</p>}

                <label> Stars
                    <input onChange={(e) => setStars(e.target.value)}></input>
                </label>
                {errors.stars && <p>{errors.stars}</p>}

                <button className='submit-button'>Submit</button>
                <button className='cancel-button' onClick={closeModal}>Cancel</button>

            </form>
        </div>
    )

}

export default ReviewForm;
