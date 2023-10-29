import '../AllSpots/AllSpots.css'
import SpotItem from "../SpotItem";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserSpotsThunk } from '../../store/spotReducer';
import { Link } from 'react-router-dom';



function UserPage() {

    const dispatch = useDispatch();

    // dispatch(fetchUserSpotsThunk())
    // useEffect(() => {
    //     dispatch(fetchUserSpotsThunk());

    // }, [dispatch]);

    let spots = useSelector(state => state.spots.userSpots);

    // const [spotArr, setSpotArr] = useState(spots)



    useEffect(() => {
        dispatch(fetchUserSpotsThunk());



    }, []);

    const onClick = () => {

        dispatch(fetchUserSpotsThunk());


    }



    return (
        <>
            <h1>Manage Your Spots</h1>
            <Link to='/spots/new'>Create a New Spot</Link>

            <ul className="spot-list">
                {spots &&
                    spots.map(el => {
                        return <li onClick={onClick} className="spot-item" key={el.id} >
                            <SpotItem spot={el} user={true} />
                        </li>
                    })}
            </ul>
        </>
    )
}

export default UserPage;
