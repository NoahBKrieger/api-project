import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/AllSpots";
import SpotForm from "./components/SpotForm";
import EditSpotForm from "./components/EditSpotForm";
import SpotDetails from "./components/SpotDetails";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>

        <AllSpots exact path='/' />
        <SpotForm path='/spots/new' />
        <EditSpotForm path='/spots/edit' />
        <SpotDetails path='spots/:id' />

      </Switch>}
    </>
  );
}

export default App;
