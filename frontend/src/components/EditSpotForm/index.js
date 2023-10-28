import '../SpotForm/SpotForm.css'

import { editSpotThunk } from "../../store/spotReducer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

function EditSpotForm() {

    const dispatch = useDispatch();

    const history = useHistory()

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
        setSpotName(oldSpot.name)
        setAddress(oldSpot.address)
        setCity(oldSpot.city)
        setState(oldSpot.state)
        setCountry(oldSpot.country)
        setLng(oldSpot.lng)
        setLat(oldSpot.lat)
        setDesc(oldSpot.description)
        setPrice(oldSpot.price)


    }, [])



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
            .then(() => {



                if (!newSpot2.errors) {
                    console.log('success')
                    history.push('/spots/user')
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

        <>
            <h1>Edit Spot: {oldSpot.name}</h1>
            <form className="form" onSubmit={handleSubmit}>

                <label> Name Of Spot
                    <input defaultValue={oldSpot.name} onChange={(e) => setSpotName(e.target.value)}></input>
                </label>
                {errors.name && <p>{errors.name}</p>}

                <label> Address
                    <input defaultValue={oldSpot.address} onChange={(e) => setAddress(e.target.value)}></input>
                </label>
                {errors.address && <p>{errors.address}</p>}


                <label> City
                    <input defaultValue={oldSpot.city} onChange={(e) => setCity(e.target.value)}></input>
                </label>
                {errors.city && <p>{errors.city}</p>}


                <label> State
                    <input defaultValue={oldSpot.state} onChange={(e) => setState(e.target.value)}></input>
                </label>
                {errors.state && <p>{errors.state}</p>}


                <label> Country
                    <input defaultValue={oldSpot.country} onChange={(e) => setCountry(e.target.value)}></input>
                </label>
                {errors.country && <p>{errors.country}</p>}


                <label> Longitude
                    <input defaultValue={oldSpot.lng} onChange={(e) => setLng(e.target.value)}></input>
                </label>
                {errors.lng && <p>{errors.lng}</p>}


                <label> Latitude
                    <input defaultValue={oldSpot.lat} onChange={(e) => setLat(e.target.value)}></input>
                </label>
                {errors.lat && <p>{errors.lat}</p>}


                <label> Description
                    <textarea defaultValue={oldSpot.description} onChange={(e) => setDesc(e.target.value)}></textarea>
                </label>
                {errors.description && <p>{errors.description}</p>}


                <label> Price
                    <input defaultValue={oldSpot.price} onChange={(e) => setPrice(e.target.value)}></input>
                </label>
                {errors.price && <p>{errors.price}</p>}


                <button className='submit-button' >Submit</button>



            </form>
        </>
    )
}

export default EditSpotForm;
