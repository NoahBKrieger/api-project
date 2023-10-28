import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const pic = 'https://cdn.forumcomm.com/dims4/default/32af336/2147483647/strip/false/crop/4936x3579+0+0/resize/1486x1077!/quality/90/?url=https%3A%2F%2Fforum-communications-production-web.s3.us-west-2.amazonaws.com%2Fbrightspot%2Fb0%2F59%2F83d92fe74aaf9457ed1623abf60f%2F080122.B.FF.HEMPCRETE.01.jpg'

function SpotPage() {

    const history = useHistory()


    const spot = useSelector(state => (state.spots.currSpot))
    console.log('currspot', spot)

    const reviews = useSelector(state => state.reviews.reviews)

    const userId = useSelector(state => state.session.user.id)
    console.log(userId)

    let hasReview = false
    const filterdReviews = reviews.filter((el) => { return el.userId === userId })
    if (filterdReviews.length > 0) { hasReview = true }

    const imageArr = spot.SpotImages && spot.SpotImages.filter(el => { return el.preview === false })

    const postReviewClick = () => {

        history.push(`/spots/${spot.id}/review/new`)

    }

    return (

        <>
            <h1>{spot.name}</h1>
            <div>{spot.city} , {spot.state} , {spot.country}</div>
            <div className="images">
                <img src={pic} alt='preview' style={{ width: 650 + 'px', height: 400 + 'px' }}></img>
                <ol>
                    {imageArr && imageArr.map(el => {
                        return <li>
                            <img src={pic} alt={el.url + '-   picture'} style={{ width: 300 + 'px', height: 200 + 'px' }}></img>
                        </li>
                    })}
                </ol>
            </div>
            <h2>Hosted by {spot && spot.Owner.firstName}  {spot && spot.Owner.lastName}</h2>
            {/* <div> latitude: {spot.lat} longitude: {spot.lng}</div> */}
            <div>Description: {spot.description}</div>
            <div>Price: ${spot.price}</div>
            <div>Average Rating: {spot.avgStarRating} Stars</div>

            <div>
                {reviews.length ? <h2>Reviews</h2> : <h2>New</h2>}

                <ol className="review-list">
                    {reviews.map(el => {
                        return <li> review: {el.review}, stars: {el.stars}</li>
                    })}
                </ol>

                {userId &&
                    userId !== spot.Owner.id &&
                    !hasReview &&
                    <button onClick={postReviewClick} >Post Your Review</button>}

            </div>
        </>

    )

}

export default SpotPage;
