
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { addReviewThunk } from "../../store/reviewReducer";



import '../SpotForm/SpotForm.css'


function ReviewForm() {

    const dispatch = useDispatch();
    const history = useHistory();

    const spot = useSelector(state => state.spots.currSpot);


    const [reviewText, setReviewText] = useState('')
    const [stars, setStars] = useState(1)
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newReview = {}

        newReview.review = reviewText
        newReview.stars = Number(stars)

        console.log('newreview----', newReview)
        setErrors({})

        let newReview2 = dispatch(addReviewThunk(spot.id, newReview))
            .then(() => {

                if (!(newReview2.errors)) {
                    console.log('success')
                    history.push(`/spots/${spot.id}`)
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

        <>
            <h1>Add a Review to {spot.name}</h1>
            <form className="form" onSubmit={handleSubmit}>

                <label> Review Text
                    <input onChange={(e) => setReviewText(e.target.value)}></input>
                </label>
                {errors.review && <p>{errors.review}</p>}

                <label> Stars
                    <input onChange={(e) => setStars(e.target.value)}></input>
                </label>
                {errors.stars && <p>{errors.stars}</p>}

                <button className='submit-button'>Submit</button>

            </form>
        </>
    )

}

export default ReviewForm;
