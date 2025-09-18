import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from "react-router-dom";
import SearchForm from "./SearchForm";
import PhotoContainer from "./PhotoContainer";
import Nav from "./Nav";
import NotFound from './NotFound';



const App =()=> {
    return(
      <BrowserRouter>
      <div className="container"> 
      <SearchForm />
      <Nav />
      <Switch>
        <Route exact path="/">
        <Redirect to="/waterfall" />
        </Route>
        <Route exact path="/waterfall" render={()=>  <PhotoContainer keyWord={"waterfall"} />} />
        <Route exact path="/skies" render={()=>  <PhotoContainer keyWord={"skies"} />} />
        <Route exact path="/sea" render={()=>  <PhotoContainer keyWord={"sea"} />} />
        <Route exact path={`/search/:topic`} render={(props)=>  <PhotoContainer keyWord={props.match.params.topic} />} />
        <Route component={NotFound} />
      </Switch>

      </div>
      </BrowserRouter>
    );
  
}

export default App;