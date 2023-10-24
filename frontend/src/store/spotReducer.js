import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/loadSpots'
const LOAD_SPOT = 'spots/loadSpot'
const ADD_SPOT = 'spots/addSpot'
const EDIT_SPOT = 'spots/editSpot'
const DELETE_SPOT = 'spots/deleteSpot'

//get all

export const fetchSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const spots = await response.json();
    console.log('spots', spots)
    dispatch(loadSpots(spots.Spots));
};

export const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        payload: spots
    };
};

//get one

export const getSpot = (spot) => ({
    type: LOAD_SPOT,
    payload: spot
});

export const getSpotThunk = (spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spot.id}`);
    const thisSpot = await response.json();
    dispatch(getSpot(thisSpot));
}

//add

export const addSpotThunk = (spot) => async (dispatch) => {

    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spot)
    });




    if (response.ok) {

        // receiving response in promise error

        const newSpot = await response.json();
        console.log('newSpot ++++', newSpot)
        dispatch(addSpot(newSpot))
        return newSpot;
    } else {
        const newSpot = await response.json();
        console.log('errors: ----- ', newSpot.errors)
    }
};

export const addSpot = (spot) => {
    return {
        type: ADD_SPOT,
        payload: spot
    }
}

//edit
export const editSpotThunk = (payload) => async (dispatch) => {

    const response = await csrfFetch(
        `/api/reports/${payload.id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }
    )


    if (response.ok) {
        const editedSpot = await response.json();
        dispatch(editSpot(editedSpot))
        return editedSpot;
    } else {
        const responseBody = await response.json();

        console.log('responseBody -- ', responseBody);
        console.log('error on response for edit spot')
        throw new Error('edit spot error')

    }
}


export const editSpot = (spot) => {
    return {
        type: EDIT_SPOT,
        payload: spot
    }
}

//delete

export const deleteSpot = (id) => {

    return {
        type: DELETE_SPOT,
        payload: id
    }
}

export const deleteSpotThunk = (id) => async (dispatch) => {


    const response = await csrfFetch(`/api/reports/${id}`, { method: "DELETE", })

    if (response.ok) {
        dispatch(deleteSpot(id))
    } else {
        console.log('error on response for remove report')
        throw new Error('remove report')
    }
}



const initialState = { spots: [], currSpot: {} };

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:



            return { ...state, spots: action.payload };
        case LOAD_SPOT:
            return { ...state, currSpot: action.payload }
        case ADD_SPOT:
            return { ...state, spots: [...state.spots, action.payload] };
        case EDIT_SPOT:
            const newSpots = state.spots
            newSpots[action.payload.id] = action.payload
            return { ...state, spots: newSpots }
        case DELETE_SPOT:
            const newSpots2 = state.spots
            delete newSpots2[action.payload]
            return { ...state, spots: newSpots2 }
        default:
            return state;
    }
};

export default spotReducer;
