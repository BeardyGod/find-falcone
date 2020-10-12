import React from 'react';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Game from './components/game/Game';
import Success from './components/game/components/Success';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Header />
      <Router>
        <Switch>
          <Route path="/" exact component={Game}/>
          <Route path="/success" exact component={Success}/>
          <Route path="*" component={Game}/>
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
