import React, { Component, useReducer } from 'react';
import {Collapse,Navbar,NavbarToggler,NavbarBrand,Nav,NavItem,NavLink,UncontrolledDropdown,
 Button, Input, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Table, Form, FormGroup, Container, Label, InputGroup} from "reactstrap";
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import axios from 'axios';
import {Helmet} from 'react-helmet'
import {Backend_Url} from './backend_url'
import Background_Image from '../images/image_1.jpg'

  class PageNotFound extends Component{
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
        <div style={{backgroundImage: "url(" + Background_Image + ")"}}>
          <div style={{backgroundColor: '#FFFFFF', minHeight: '650px', opacity: 0.9}}>
            <Helmet>
            <title>Page not found</title>
            </Helmet>
            <Container>
                <br/>
                <h1 style={{marginTop: '120px', fontWeight: 'bold'}}>
                  404 - Page Not Found
                </h1>
                <h5 style={{marginTop: '80px'}}>
                  The page you're looking for has not been found, please check your link and try again
                </h5>
                <br/><br/>
                <a href='/' style={{color: 'inherit'}}>
                    Click here to visit our homepage instead
                </a>
            </Container>
          </div>
        </div>
      );
    }

  };
  
  export default withCookies(PageNotFound);