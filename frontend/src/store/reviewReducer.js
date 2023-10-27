import { csrfFetch } from "./csrf";

const CREATE_REVIEW = 'reviews/create';
const DELETE_REVIEW = 'reviews/delete';
const LOAD_REVIEWS = 'reviews/load';


// current user reviews
export const fetchUserReviewsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/reviews/current');
    const reviews = await response.json();
    console.log('reviews', reviews)
    dispatch(loadReviews(reviews.Reviews));
};

export const loadReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        payload: reviews
    };
};

// get spot's reviews

export const getSpotReviewsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const reviews = await response.json();
    console.log('reviews', reviews)
    dispatch(loadReviews(reviews.Reviews));
};

export const loadSpotReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        payload: reviews
    };
};

// create review

export const createReviewThunk = (spotId, review) => async (dispatch) => {

    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
    });




    if (response.ok) {

        // receiving response in promise error

        const newReview = await response.json();
        console.log('newReview ++++', newReview)
        dispatch(addReview(newReview))
        return newReview;
    } else {
        const newReview = await response.json();
        console.log('errors: ----- ', newReview.errors)
    }
};

export const addReview = (review) => {

    return {
        type: CREATE_REVIEW,
        payload: review
    }
}

// delete
export const deleteReview = (id) => {

    return {
        type: DELETE_REVIEW,
        payload: id
    }
}

export const deleteReviewThunk = (id) => async (dispatch) => {


    const response = await csrfFetch(`/api/reviews/${id}`, { method: "DELETE", })

    if (response.ok) {
        dispatch(deleteReview(id))
    } else {
        console.log('error on response for remove review')
        throw new Error('remove a review')
    }
}

const initialState = { reviews: [], };

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {

        case LOAD_REVIEWS:
            return { ...state, reviews: action.payload }
        case CREATE_REVIEW:
            return { ...state, reviews: [...state.reviews, action.payload] }
        case DELETE_REVIEW:
            const newReviews = state.reviews
            delete newReviews[action.payload]
            return { ...state, review: newReviews }
        default:
            return state;
    }
};

export default reviewReducer;
