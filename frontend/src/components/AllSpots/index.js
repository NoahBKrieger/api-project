
import { csrfFetch } from "../../store/csrf";
import './AllSpots.css'
import SpotItem from "../SpotItem";


const getSpots = async () => {

    const response = await csrfFetch('/api/spots', {
        method: "GET"
    });

    const data = await response.json()
    return data.Spots;
}
const spots = await getSpots()


function AllSpots() {




    return (
        <>
            <h1>ALL SPOTS</h1>
            <ul className="spot-list">
                {spots.map(el => {
                    return <li className="spot-item" key={el.id}>
                        <SpotItem spot={el} />
                    </li>
                })}

            </ul>
        </>
    )
}

export default AllSpots;
