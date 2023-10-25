import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/AllSpots";
import SpotForm from "./components/SpotForm";
import EditSpotForm from "./components/EditSpotForm";
import SpotPage from "./components/SpotPage";
import CurrReviews from "./components/CurrReviews";


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
        <Route exact path='/spots/:spotId' component={SpotPage} />

        <CurrReviews path='/reviews/current' />


      </Switch>}
    </>
  );
}

export default App;
