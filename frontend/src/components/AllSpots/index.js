

import './AllSpots.css'
import SpotItem from "../SpotItem";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotsThunk } from '../../store/spotReducer';

// const getSpots = async () => {

//     const response = await csrfFetch('/api/spots', {
//         method: "GET"
//     });

//     const data = await response.json()
//     return data.Spots;
// }
// const spots = await getSpots()


function AllSpots() {


    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots.spots);

    useEffect(() => {
        dispatch(fetchSpotsThunk());
    }, [dispatch]);



    return (
        <>
            <h1>ALL SPOTS</h1>
            <ul className="spot-list">
                {spots &&
                    spots.map(el => {
                        return <li className="spot-item" key={el.id}>
                            <SpotItem spot={el} />
                        </li>
                    })}

            </ul>
        </>
    )
}

export default AllSpots;
