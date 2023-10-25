import './AllSpots.css'
import SpotItem from "../SpotItem";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotsThunk } from '../../store/spotReducer';





function AllSpots() {


    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots.spots);
    console.log('spots', spots)

    useEffect(() => {
        dispatch(fetchSpotsThunk());
    }, [dispatch]);

    console.log('spots', spots)


    return (
        <>
            <h1>ALL SPOTS</h1>
            <ul className="spot-list">
                {spots &&


                    spots.map(el => {
                        return <li className="spot-item" key={el.id} >
                            <SpotItem spot={el} />
                        </li>
                    })}
            </ul>
        </>
    )
}

export default AllSpots;
