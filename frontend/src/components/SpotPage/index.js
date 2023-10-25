// import { useEffect } from "react";
import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";

const pic = 'https://cdn.forumcomm.com/dims4/default/32af336/2147483647/strip/false/crop/4936x3579+0+0/resize/1486x1077!/quality/90/?url=https%3A%2F%2Fforum-communications-production-web.s3.us-west-2.amazonaws.com%2Fbrightspot%2Fb0%2F59%2F83d92fe74aaf9457ed1623abf60f%2F080122.B.FF.HEMPCRETE.01.jpg'

function SpotPage() {


    // const dispatch = useDispatch();
    // const { spotId } = useParams();

    const spot = useSelector(state => (state.spots.currSpot))

    console.log('current spot ---', spot)
    return (



        <>
            <h1>{spot.name}</h1>
            <img src={pic} alt='preview' style={{ width: 700 + 'px', height: 400 + 'px' }}></img>
            <div>{spot.address} , {spot.city} , {spot.state} , {spot.country}</div>
            <div> latitude: {spot.lat} longitude: {spot.lng}</div>
            <div>{spot.description}</div>
            <div>Price: ${spot.price}</div>
            <div>Average Rating: {spot.avgRating} Stars</div>
        </>

    )

}

export default SpotPage;
