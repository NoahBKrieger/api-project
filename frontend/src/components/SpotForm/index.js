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
    const [price, setPrice] = useState(1)
    const [errors, setErrors] = useState({});
    const [previewImgUrl, setPreviewImgUrl] = useState('')
    const [imgUrl1, setImgUrl1] = useState('')
    const [imgUrl2, setImgUrl2] = useState('')
    const [imgUrl3, setImgUrl3] = useState('')
    const [imgUrl4, setImgUrl4] = useState('')

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

        let newSpot2 = dispatch(addSpotThunk(newSpot))
            .then(async (res) => {

                if (!newSpot2.errors) {

                    await csrfFetch(`/api/spots/${res.id}/images`, {

                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newPrevImg)
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



    return (

        <>
            <form className="form" onSubmit={handleSubmit}>
                <h1 className="form-title">New Spot Form</h1>

                <h2>Where's your place located?</h2>
                <div className="location-div">
                    <label> Country
                        <input onChange={(e) => setCountry(e.target.value)}></input>
                    </label>
                    {errors.country && <p>{errors.country}</p>}

                    <label> Street Address
                        <input onChange={(e) => setAddress(e.target.value)}></input>
                    </label>
                    {errors.address && <p>{errors.address}</p>}



                    <div className="city-state">
                        <label> City,
                            <input onChange={(e) => setCity(e.target.value)}></input>
                        </label>
                        {errors.city && <p>{errors.city}</p>}

                        <label> State
                            <input onChange={(e) => setState(e.target.value)}></input>
                        </label>
                        {errors.state && <p>{errors.state}</p>}

                    </div>

                    <div className="lat-lng">
                        <label> Latitude
                            <input onChange={(e) => setLat(e.target.value)}></input>
                        </label>
                        {errors.lat && <p>{errors.lat}</p>}

                        <label> Longitude
                            <input onChange={(e) => setLng(e.target.value)}></input>
                        </label>
                        {errors.lng && <p>{errors.lng}</p>}

                    </div>

                </div>

                <h2>Describe your place to guests</h2>
                <label> Description
                    <textarea onChange={(e) => setDesc(e.target.value)}></textarea>
                </label>
                {errors.description && <p>{errors.description}</p>}

                <label> Name Of Spot
                    <input onChange={(e) => setSpotName(e.target.value)}></input>
                </label>
                {errors.name && <p>{errors.name}</p>}

                <div className="price-div">

                    <h2>Set a base price for your spot</h2>
                    <label> $
                        <input onChange={(e) => setPrice(e.target.value)}></input>
                    </label>
                    {errors.price && <p>{errors.price}</p>}

                </div>

                <h2>Liven up your spot with photos</h2>

                <div className="add-images">

                    <label>Preview Image URL
                        <input onChange={(e) => setPreviewImgUrl(e.target.value)}></input>
                    </label>

                    <label>Image URL 1
                        <input onChange={(e) => setImgUrl1(e.target.value)}></input>
                    </label>

                    <label>Image URL 2
                        <input onChange={(e) => setImgUrl2(e.target.value)}></input>
                    </label>

                    <label>Image URL 3
                        <input onChange={(e) => setImgUrl3(e.target.value)}></input>
                    </label>

                    <label>Image URL 4
                        <input onChange={(e) => setImgUrl4(e.target.value)}></input>
                    </label>



                </div>

                <button className='submit-button'>Create Spot</button>

            </form>
        </>
    )

}

export default SpotForm;
