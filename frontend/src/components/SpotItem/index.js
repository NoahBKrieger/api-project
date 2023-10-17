function SpotItem({ spot }) {

    return (
        <div>
            {/* <h2>{spot.name}</h2> */}
            <img src={spot.previewImage} alt={`${spot.name} preview`}></img>
            <p>{`${spot.city}, ${spot.state}`}</p>
            <p>{`$${spot.price} night`}</p>
        </div>
    )
}

export default SpotItem;
