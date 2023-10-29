import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteReviewThunk, getSpotReviewsThunk } from "../../store/reviewReducer";

import './SpotPage.css'

const kK = 'https://upload.wikimedia.org/wikipedia/commons/2/25/The_Krusty_Krab.png'
const pineapple = "https://i.pinimg.com/originals/58/b3/40/58b340936b2c1ed07bed66c260b00534.png"


function SpotPage() {

    const history = useHistory()
    const dispatch = useDispatch()


    const spot = useSelector(state => (state.spots.currSpot))
    const reviews = useSelector(state => state.reviews.reviews)
    const user = useSelector(state => state.session.user)

    // check for user reviews
    let hasReview = false
    let filteredReviews
    if (user) { filteredReviews = reviews.filter((el) => { return el.userId === user.id }) }
    if (filteredReviews && filteredReviews.length > 0) { hasReview = true }

    const imageArr = spot.SpotImages && spot.SpotImages.filter(el => { return el.preview === false })
    imageArr.splice(4)
    const postReviewClick = () => {
        history.push(`/spots/${spot.id}/review/new`)
    }

    const deleteReview = (async (id) => {

        await dispatch(deleteReviewThunk(Number(id)))
            .then(dispatch(getSpotReviewsThunk(spot.id)))

    })

    const reserve = () => {

        return alert("Feature coming soon!")
    }

    return (

        <>
            <h1>{spot.name}</h1>
            <h2 className="location">{spot.city} , {spot.state} , {spot.country}</h2>
            <div className="images">
                <img src={pineapple} alt='preview' style={{ width: 650 + 'px', height: 405 + 'px' }}></img>
                <ol className="regular-images">
                    {imageArr && imageArr.map(el => {
                        return <li>
                            <img src={kK} alt={el.url + '-   picture'} style={{ width: 300 + 'px', height: 200 + 'px' }}></img>
                        </li>
                    })}
                </ol>
            </div>
            <h2>Hosted by {spot.Owner && spot.Owner.firstName}  {spot.Owner && spot.Owner.lastName}</h2>
            {/* <div> latitude: {spot.lat} longitude: {spot.lng}</div> */}

            <div className="description"> {spot.description}</div>

            <div className="reserveBox">
                <div className="reserve-info">
                    <h3> ${spot.price} per night</h3>
                    {hasReview && <h3><i class="fa fa-star"></i> {spot.avgStarRating}   --   {spot.numReviews} Reviews</h3>}
                    {!hasReview && <h3><i class="fa fa-star"></i> New</h3>}
                </div>
                <button onClick={reserve}>Reserve</button>

            </div>

            <div>
                <h2><div className="">

                    {hasReview && <div><i class="fa fa-star"></i> {spot.avgStarRating}   --   {spot.numReviews} Reviews</div>}
                    {!hasReview && <div><i class="fa fa-star"></i> New</div>}
                </div></h2>

                <ol className="review-list">
                    {reviews.map(el => {

                        if (user && (el.userId === user.id)) {
                            return <li key={el.id}> review: {el.review}, stars: {el.stars} <button
                                onClick={() => deleteReview(el.id)}>Delete
                            </button></li>
                        }
                        return <li key={el.id}> review: {el.review}, stars: {el.stars} </li>
                    })}
                </ol>

                {user &&
                    user.id !== spot.Owner.id &&
                    !hasReview &&
                    <button className="post-button" onClick={postReviewClick} >Post Your Review</button>}

            </div>
        </>

    )

}

export default SpotPage;
