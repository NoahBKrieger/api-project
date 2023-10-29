// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';


function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className='nav'>
            <div>
                <NavLink exact to="/"> <i className="fas fa-home" /></NavLink>
            </div>
            {sessionUser && <NavLink to='/spots/new'>Create a New Spot</NavLink>}
            {isLoaded && (

                <div className='profile-button'>
                    <ProfileButton user={sessionUser} />
                </div>
            )}
        </div>
    );
}

export default Navigation;
