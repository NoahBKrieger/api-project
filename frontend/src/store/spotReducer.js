import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/loadSpots'

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



const initialState = { spots: [] };

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            return { ...state, spots: [...action.payload] };
        // case ADD_ARTICLE:
        //     return { ...state, entries: [...state.entries, action.article] };
        default:
            return state;
    }
};

export default spotReducer;
