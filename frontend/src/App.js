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
import UserPage from "./components/UserPage";
import ReviewForm from "./components/ReviewForm";


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
        <Route path='/spots/user' component={UserPage} />
        <Route exact path='/spots/edit/:spotId' component={EditSpotForm} />
        <Route exact path='/spots/:spotId' component={SpotPage} />
        <Route path='/spots/:spotId/review/new' component={ReviewForm} />
        <CurrReviews path='/reviews/current' />


      </Switch>}
    </>
  );
}

export default App;
