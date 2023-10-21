
import SpotDetailsButton from "../SpotDetails";

function SpotItem({ spot }) {

    // onClick={redirect(`api/spots/${spot.id}`)}
    return (
        <div >
            {/* <h2>{spot.name}</h2> */}
            <img className='preview-image' src='' alt={`${spot.name} preview`}></img>
            <p>{`${spot.city}, ${spot.state}`}</p>
            <p>{`$${spot.price} night`}</p>
            <SpotDetailsButton spot={spot} />

        </div>
    )
}

export default SpotItem;
