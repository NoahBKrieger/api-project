import '../SpotForm/SpotForm.css'

import { editSpotThunk, getSpotThunk } from "../../store/spotReducer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getSpotReviewsThunk } from '../../store/reviewReducer';

function EditSpotForm() {

    const dispatch = useDispatch();
    const history = useHistory()
    const id = useParams()



    const oldSpot = useSelector(state => state.spots.currSpot);

    const [spotName, setSpotName] = useState(oldSpot.name)
    const [address, setAddress] = useState(oldSpot.address)
    const [city, setCity] = useState(oldSpot.city)
    const [state, setState] = useState(oldSpot.state)
    const [country, setCountry] = useState(oldSpot.country)
    const [lng, setLng] = useState(oldSpot.lng)
    const [lat, setLat] = useState(oldSpot.lat)
    const [desc, setDesc] = useState(oldSpot.description)
    const [price, setPrice] = useState(oldSpot.price)

    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function spotDispatches() { await dispatch(getSpotThunk(id.spotId)); }
        spotDispatches()
    }, [dispatch, id]);


    useEffect(() => {
        setSpotName(oldSpot.name)
        setAddress(oldSpot.address)
        setCity(oldSpot.city)
        setState(oldSpot.state)
        setCountry(oldSpot.country)
        setLng(oldSpot.lng)
        setLat(oldSpot.lat)
        setDesc(oldSpot.description)
        setPrice(oldSpot.price)
    }, [oldSpot, dispatch])

    // const [disableButton, setDisableButton] = useState(false)

    // useEffect(() => {

    //     if (spotName.length > 1 && address.length > 3 && city.length > 1 && state.length > 1 && country.length > 1 && desc.length >= 30 && price.length > 0) {
    //         setDisableButton(false)
    //     } else { setDisableButton(true) }
    // }, [spotName, address, city, state, country, desc, price])




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

        console.log('updated spot----', newSpot)


        setErrors({});


        let newSpot2 = dispatch(editSpotThunk(newSpot, Number(oldSpot.id)))
            .then(async (res) => {



                if (!newSpot2.errors) {
                    await dispatch(getSpotThunk(res.id))
                    await dispatch(getSpotReviewsThunk(res.id))

                        .then(history.push(`/spots/${res.id}`))
                }


            })
            .catch(async (res) => {

                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                    console.log('errors', errors)
                }

            })
    }

    return (

        <div className="form-page">
            <form className="form" onSubmit={handleSubmit}>
                <h1 className="form-title">Edit Spot: {oldSpot.name}</h1>


                <h2>Where's your place located?</h2>
                <h3>Guests will only get your exact address once they booked a reservation.</h3>
                <div className="location-div">
                    <label> Country
                        <input placeholder="Country" defaultValue={country} onChange={(e) => setCountry(e.target.value)}></input>
                    </label>
                    {errors.country && <p>{errors.country}</p>}

                    <label> Street Address
                        <input placeholder='Street Address' defaultValue={oldSpot.address} onChange={(e) => setAddress(e.target.value)}></input>
                    </label>
                    {errors.address && <p>{errors.address}</p>}



                    <div className="city-state">
                        <label> City,
                            <input placeholder="City" defaultValue={oldSpot.city} onChange={(e) => setCity(e.target.value)}></input>
                        </label>


                        <label> State
                            <input placeholder="State" defaultValue={oldSpot.state} onChange={(e) => setState(e.target.value)}></input>
                        </label>

                    </div>
                    <div className="city-state-errors">
                        {errors.city && <p>{errors.city}</p>}
                        {errors.state && <p className="state-errors">{errors.state}</p>}
                    </div>

                    <div className="lat-lng">
                        <label> Latitude
                            <input placeholder="Latitude" defaultValue={oldSpot.lat} onChange={(e) => setLat(e.target.value)}></input>
                        </label>
                        {errors.lat && <p>{errors.lat}</p>}

                        <label> Longitude
                            <input placeholder='Longitude' defaultValue={oldSpot.lng} onChange={(e) => setLng(e.target.value)}></input>
                        </label>
                        {errors.lng && <p>{errors.lng}</p>}

                    </div>

                </div>

                <h2>Describe your place to guests</h2>
                <h3>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</h3>
                <label> Description
                    <textarea placeholder="Please write at least 30 characters" defaultValue={oldSpot.description} onChange={(e) => setDesc(e.target.value)}></textarea>
                </label>
                {errors.description && <p>{errors.description}</p>}

                <h2>Create a title for your spot</h2>
                <h3>Catch guests' attention with a spot title that highlights what makes your place special.</h3>
                <label> Name Of Spot
                    <input placeholder="Name of your spot" defaultValue={oldSpot.name} onChange={(e) => setSpotName(e.target.value)}></input>
                </label>
                {errors.name && <p>{errors.name}</p>}

                <div className="price-div">

                    <h2>Set a base price for your spot</h2>
                    <h3>Competitive pricing can help your listing stand out and rank higher in search results.</h3>
                    <label> $
                        <input placeholder="Price per night (USD)" defaultValue={oldSpot.price} onChange={(e) => setPrice(e.target.value)}></input>
                    </label>
                    {errors.price && <p>{errors.price}</p>}

                </div>


                <button className='submit-button' >Submit</button>



            </form>
        </div>
    )
}

export default EditSpotForm;
