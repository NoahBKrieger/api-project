import '../AllSpots/AllSpots.css'
import SpotItem from "../SpotItem";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserSpotsThunk } from '../../store/spotReducer';
import { Link } from 'react-router-dom';



function UserPage() {
    const [spotArr, setSpotArr] = useState([])
    const dispatch = useDispatch();

    const spots = useSelector(state => state.spots.userSpots);
    // dispatch(fetchUserSpotsThunk())

    console.log('spots', spots)


    useEffect(() => {
        dispatch(fetchUserSpotsThunk());

    }, [dispatch]);

    // useEffect(() => {

    //     setSpotArr(spots)
    // }, [spots]);




    return (
        <>
            <h1>Manage Your Spots</h1>
            <Link to='/spots/new'>Create a New Spot</Link>

            <ul className="spot-list">
                {spots &&


                    spots.map(el => {
                        return <li className="spot-item" key={el.id} >
                            <SpotItem spot={el} user={true} />
                        </li>
                    })}
            </ul>
        </>
    )
}

export default UserPage;
