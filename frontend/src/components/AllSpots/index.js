import { csrfFetch } from "../../store/csrf";
import './allSpots.css'


const getSpots = async () => {

    const response = await csrfFetch('/api/spots', {
        method: "GET"
    });

    const data = await response.json()

    console.log(data)

    return data.Spots;

}

const spots = await getSpots()


function AllSpots() {


    console.log('spots', spots)


    return (
        <>
            <h1>ALL SPOTS</h1>
            <ul>
                {spots.map(el => {
                    return <li className="spot-item">{el.name + '  ' + el.previewImage + '  $' + el.price}</li>
                })}

            </ul>
        </>
    )
}

export default AllSpots;
