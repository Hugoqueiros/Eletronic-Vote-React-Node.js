import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Events from './pages/Events/Events';
import Login from './pages/Login/Login';
import Vote from './pages/Vote/vote';
import Expirados from './pages/Expirados/expirados';
import Results from './pages/Results/results';
import Proximo from './pages/Proximo/proximo';
import Recuperar from './pages/Recuperar/recuperar';



function App() {

  return (

    <Router>
      <Switch>
        <Route exact path="/expirados" exact component={(props) => <Expirados />} />
        <Route exact path="/" exact component={(props) => <Login />} />
        <Route exact path="/eventos" exact component={ (props) => <Events/>} />
        <Route exact path="/eventos/:id" exact component={ (props) => <Vote/>} />
        <Route exact path="/eventos/results/:id" exact component={ (props) => <Results/>} />
        <Route exact path="/proximos" exact component={ (props) => <Proximo/>} />
        <Route exact path="/recuperar" exact component={ (props) => <Recuperar/>} />
        <Route exact path="*" exact component={ (props) => <Login/>} />
      </Switch>
    </Router>

  );
}

export default App;
