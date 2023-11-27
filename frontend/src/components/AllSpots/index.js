import './AllSpots.css'
import SpotItem from "../SpotItem";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotsThunk } from '../../store/spotReducer';


function AllSpots() {

    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots.spots);
    const newSpots = spots.toReversed()
    useEffect(() => {
        dispatch(fetchSpotsThunk());
    }, [dispatch]);

    return (
        <>
            <ul className="spot-list">
                {newSpots &&

                    newSpots.map(el => {
                        return <li className="spot-item" key={el.id} >
                            <SpotItem spot={el} />
                        </li>
                    })}
            </ul>
        </>
    )
}

export default AllSpots;
