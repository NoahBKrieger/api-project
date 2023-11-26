// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';


function Navigation({ isLoaded }) {

    const history = useHistory()
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className='nav'>
            <div className='title-link' onClick={() => history.push('/')}>
                <i class="fa-solid fa-2xl fa-spider" >
                </i>
                Air Krusty & Krab

            </div>
            <div className='right-box'>
                {sessionUser && <NavLink className='new-spot-link' to='/spots/new'>Create a New Spot</NavLink>}
                {isLoaded && (

                    <div className='profile-button'>
                        <ProfileButton user={sessionUser} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navigation;
