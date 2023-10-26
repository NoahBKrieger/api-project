import { useSelector } from "react-redux";

const pic = 'https://cdn.forumcomm.com/dims4/default/32af336/2147483647/strip/false/crop/4936x3579+0+0/resize/1486x1077!/quality/90/?url=https%3A%2F%2Fforum-communications-production-web.s3.us-west-2.amazonaws.com%2Fbrightspot%2Fb0%2F59%2F83d92fe74aaf9457ed1623abf60f%2F080122.B.FF.HEMPCRETE.01.jpg'

function SpotPage() {




    const spot = useSelector(state => (state.spots.currSpot))
    const reviews = useSelector(state => state.reviews.reviews)

    const imageArr = spot.SpotImages && spot.SpotImages.filter(el => { return el.preview === false })
    console.log('imageArr', imageArr)


    return (

        <>
            <h1>{spot.name}</h1>
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
            <div>{spot.address} , {spot.city} , {spot.state} , {spot.country}</div>
            <div> latitude: {spot.lat} longitude: {spot.lng}</div>
            <div>{spot.description}</div>
            <div>Price: ${spot.price}</div>
            <div>Average Rating: {spot.avgStarRating} Stars</div>

            <div>
                <h2>Reviews</h2>
                <ul className="review-list">
                    {reviews.map(el => {
                        return <li> review: {el.review}, stars: {el.stars}</li>
                    })}

                </ul>
                <button>Add a Review</button>

            </div>
        </>

    )

}

export default SpotPage;
