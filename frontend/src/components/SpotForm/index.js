import { addSpotThunk } from "../../store/spotReducer";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { getSpotThunk } from "../../store/spotReducer";
import { getSpotReviewsThunk } from "../../store/reviewReducer";


import './SpotForm.css'
import { csrfFetch } from "../../store/csrf";


function SpotForm() {

    const dispatch = useDispatch();
    const history = useHistory();


    const [spotName, setSpotName] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [lng, setLng] = useState(0)
    const [lat, setLat] = useState(0)
    const [desc, setDesc] = useState('')
    const [price, setPrice] = useState(0)
    const [errors, setErrors] = useState({});

    const [previewImgUrl, setPreviewImgUrl] = useState('')
    const [imgUrl1, setImgUrl1] = useState('')
    const [imgUrl2, setImgUrl2] = useState('')
    const [imgUrl3, setImgUrl3] = useState('')
    const [imgUrl4, setImgUrl4] = useState('')
    const [prevErrors, setPrevErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newSpot = {}

        newSpot.name = spotName
        newSpot.address = address
        newSpot.city = city
        newSpot.state = state
        newSpot.country = country
        newSpot.lng = Number(lng)
        newSpot.lat = Number(lat)
        newSpot.description = desc
        newSpot.price = Number(price)
        newSpot.img = previewImgUrl

        const newPrevImg = {}

        newPrevImg.url = previewImgUrl
        newPrevImg.preview = true

        const img1 = {}
        if (imgUrl1 !== '') {
            img1.url = imgUrl1
            img1.preview = false
        }

        const img2 = {}
        if (imgUrl2 !== '') {
            img2.url = imgUrl2
            img2.preview = false
        }

        const img3 = {}
        if (imgUrl3 !== '') {
            img3.url = imgUrl3
            img3.preview = false
        }

        const img4 = {}
        if (imgUrl4 !== '') {
            img4.url = imgUrl4
            img4.preview = false
        }


        setErrors({})
        setPrevErrors({})

        let newSpot2 = dispatch(addSpotThunk(newSpot))
            .then(async (res) => {

                if (!newSpot2.errors) {

                    await csrfFetch(`/api/spots/${res.id}/images`, {

                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newPrevImg)
                    })
                        .catch(async prevRes => {

                            const prevData = await prevRes.json()

                            if (prevData && prevData.errors) {

                                setPrevErrors(prevData.errors)
                            }


                        })

                    img1.url && await csrfFetch(`/api/spots/${res.id}/images`, {

                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(img1)
                    })

                    img2.url && await csrfFetch(`/api/spots/${res.id}/images`, {

                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(img2)
                    })

                    img3.url && await csrfFetch(`/api/spots/${res.id}/images`, {

                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(img3)
                    })

                    img4.url && await csrfFetch(`/api/spots/${res.id}/images`, {

                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(img4)
                    })




                    await dispatch(getSpotThunk(res.id))
                    await dispatch(getSpotReviewsThunk(res.id))

                        .then(history.push(`/spots/${res.id}`))
                }
            })

            .catch(async (res) => {

                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                    console.log('errs---', data.errors)
                }
            })

        // .then(history.push('/'))
        // console.log('addDis', addDis)
    }

    // useEffect(() => {

    //     if (previewImgUrl.endsWith('.png') || previewImgUrl.endsWith('.img') || previewImgUrl.endsWith('.jpg')) {
    //         setPrevErrors({})
    //     } else { setPrevErrors({ errors: 'Must be a valid image url' }) }

    // }, [previewImgUrl])

    return (

        <div className="form-page">
            <form className="form" onSubmit={handleSubmit}>
                <h1 className="form-title">Create a New Spot</h1>

                <h2>Where's your place located?</h2>
                <h3>Guests will only get your exact address once they booked a reservation.</h3>
                <div className="location-div">
                    <label> Country
                        <input placeholder="Country" onChange={(e) => setCountry(e.target.value)}></input>
                    </label>
                    {errors.country && <p>{errors.country}</p>}

                    <label> Street Address
                        <input placeholder='Street Address' onChange={(e) => setAddress(e.target.value)}></input>
                    </label>
                    {errors.address && <p>{errors.address}</p>}



                    <div className="city-state">
                        <label> City,
                            <input placeholder="City" onChange={(e) => setCity(e.target.value)}></input>
                        </label>


                        <label> State
                            <input placeholder="State" onChange={(e) => setState(e.target.value)}></input>
                        </label>

                    </div>
                    <div className="city-state-errors">
                        {errors.city && <p>{errors.city}</p>}
                        {errors.state && <p className="state-errors">{errors.state}</p>}
                    </div>

                    <div className="lat-lng">
                        <label> Latitude
                            <input placeholder="Latitude" onChange={(e) => setLat(e.target.value)}></input>
                        </label>
                        {errors.lat && <p>{errors.lat}</p>}

                        <label> Longitude
                            <input placeholder='Longitude' onChange={(e) => setLng(e.target.value)}></input>
                        </label>
                        {errors.lng && <p>{errors.lng}</p>}

                    </div>

                </div>

                <h2>Describe your place to guests</h2>
                <h3>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</h3>
                <label> Description
                    <textarea placeholder="Please write at least 30 characters" onChange={(e) => setDesc(e.target.value)}></textarea>
                </label>
                {errors.description && <p>{errors.description}</p>}

                <h2>Create a title for your spot</h2>
                <h3>Catch guests' attention with a spot title that highlights what makes your place special.</h3>
                <label> Name Of Spot
                    <input placeholder="Name of your spot" onChange={(e) => setSpotName(e.target.value)}></input>
                </label>
                {errors.name && <p>{errors.name}</p>}

                <div className="price-div">

                    <h2>Set a base price for your spot</h2>
                    <h3>Competitive pricing can help your listing stand out and rank higher in search results.</h3>
                    <label> $
                        <input placeholder="Price per night (USD)" onChange={(e) => setPrice(e.target.value)}></input>
                    </label>
                    {errors.price && <p>{errors.price}</p>}

                </div>

                <h2>Liven up your spot with photos</h2>
                <h3>Submit a link to at least one photo to publish your spot.</h3>

                <div className="add-images">

                    <label>Preview Image URL
                        <input placeholder="Preview Image URL" onChange={(e) => setPreviewImgUrl(e.target.value)}></input>
                    </label>
                    {errors.img && <p>{errors.img}</p>}
                    {prevErrors.url && <p>{prevErrors.url}</p>}

                    <label>Image URL 1
                        <input placeholder="Image URL" onChange={(e) => setImgUrl1(e.target.value)}></input>
                    </label>

                    <label>Image URL 2
                        <input placeholder="Image URL" onChange={(e) => setImgUrl2(e.target.value)}></input>
                    </label>

                    <label>Image URL 3
                        <input placeholder="Image URL" onChange={(e) => setImgUrl3(e.target.value)}></input>
                    </label>

                    <label>Image URL 4
                        <input placeholder="Image URL" onChange={(e) => setImgUrl4(e.target.value)}></input>
                    </label>



                </div>

                <button className='submit-button'>Create Spot</button>

            </form>
        </div>
    )

}

export default SpotForm;
