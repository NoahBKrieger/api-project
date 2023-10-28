import { addSpotThunk } from "../../store/spotReducer";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";


import '../SpotForm/SpotForm.css'


function ReviewForm() {

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

        console.log('newspot----', newSpot)
        setErrors({})

        return await dispatch(addSpotThunk(newSpot))
            .then(() => {

                if (!(Object.keys(errors).length)) {
                    console.log('success')
                    history.push('/spots/user')
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
            <h1>New Spot Form</h1>
            <form className="form" onSubmit={handleSubmit}>

                <label> Name Of Spot
                    <input onChange={(e) => setSpotName(e.target.value)}></input>
                </label>
                {errors.name && <p>{errors.name}</p>}

                <label> Address
                    <input onChange={(e) => setAddress(e.target.value)}></input>
                </label>
                {errors.address && <p>{errors.address}</p>}

                <label> City
                    <input onChange={(e) => setCity(e.target.value)}></input>
                </label>
                {errors.city && <p>{errors.city}</p>}

                <label> State
                    <input onChange={(e) => setState(e.target.value)}></input>
                </label>
                {errors.state && <p>{errors.state}</p>}

                <label> Country
                    <input onChange={(e) => setCountry(e.target.value)}></input>
                </label>
                {errors.country && <p>{errors.country}</p>}

                <label> Longitude
                    <input onChange={(e) => setLng(e.target.value)}></input>
                </label>
                {errors.lng && <p>{errors.lng}</p>}

                <label> Latitude
                    <input onChange={(e) => setLat(e.target.value)}></input>
                </label>
                {errors.lat && <p>{errors.lat}</p>}

                <label> Description
                    <textarea onChange={(e) => setDesc(e.target.value)}></textarea>
                </label>
                {errors.description && <p>{errors.description}</p>}

                <label> Price
                    <input onChange={(e) => setPrice(e.target.value)}></input>
                </label>
                {errors.price && <p>{errors.price}</p>}

                <button className='submit-button'>Submit</button>

            </form>
        </>
    )

}

export default ReviewForm;
