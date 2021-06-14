import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import PageNotFound from './components/page_not_found'
import SignIn from './components/signin'
import Signup from './components/signup'
import Dashboard from './components/dashboard'

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props) { 
    super(props);
    this.state = {

    };
  }
  componentDidMount() {

  }

  render() {
    return (
          <div className="App" style={{}}>
                  <BrowserRouter>
                      <Switch>
                          <Route path='/' exact={true} component={SignIn}/>
                          <Route path='/signup' exact={true} component={Signup}/>
                          <Route path='/dashboard' exact={true} component={Dashboard}/>
                          <Route path="*" component={PageNotFound} />
                      </Switch>
                  </BrowserRouter>    
          </div>
    );
  }
}

export default withCookies(App);
