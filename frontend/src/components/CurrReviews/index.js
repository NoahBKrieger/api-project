
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserReviewsThunk } from '../../store/reviewReducer';

function CurrReviews() {


    const dispatch = useDispatch();
    const reviews = useSelector(state => state.reviews.reviews);


    useEffect(() => {
        dispatch(fetchUserReviewsThunk());
    }, [dispatch])

    return (




        <>
            <h1>User's Reviews</h1>

            <ul className='review-list'>
                {reviews && reviews.map((el) => {

                    return <li>review: {el.review}, stars:{el.stars}, spot: {el.id}</li>

                }
                )}

            </ul>

        </>
    )
}

export default CurrReviews;
