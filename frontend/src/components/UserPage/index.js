import '../AllSpots'
import SpotItem from "../SpotItem";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserSpotsThunk } from '../../store/spotReducer';
import { Link } from 'react-router-dom';


function UserPage() {

    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots.userSpots);
    console.log('spots', spots)

    useEffect(() => {
        dispatch(fetchUserSpotsThunk());
    }, [dispatch]);




    return (
        <>
            <h1>YOUR SPOTS</h1>
            <Link to='/spots/new'>Create a New Spot</Link>

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

export default UserPage;
