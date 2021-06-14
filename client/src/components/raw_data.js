import React, { Component, useReducer } from 'react';
import {Collapse, RawDataToggler,RawDataBrand,Nav,NavItem,NavLink,UncontrolledDropdown,
 Button, Input, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, Container, Label, InputGroup} from "reactstrap";
import axios from 'axios';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import {Helmet} from 'react-helmet'
import {Backend_Url} from './backend_url'
import {
  Audio,
  BallTriangle,
  Bars,
  Circles,
  Grid,
  Hearts,
  Oval,
  Puff,
  Rings,
  SpinningCircles,
  TailSpin,
  ThreeDots,
} from '@agney/react-loading';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';

  class RawData extends Component{
    static propTypes = {
      cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) { 
      super(props);
      this.state = {
        raw_data: this.props.raw_data
      };

      this.HandleChange = (e) =>{
        this.setState({[e.target.name]: e.target.value});
      };
    }

    componentDidMount() {

    }




    render() {
      var raw_data = this.state.raw_data

      if(raw_data == null){
        return (
          <div>
              <Helmet>
                <title>Dashboard - Raw Data</title>
                {/* <meta name="description" content="" /> */}
              </Helmet>
              <br/>
              <h6 style={{fontWeight: 'bold'}}>Raw Data</h6>
              <br/><br/><br/><br/>
              <h5>You need to import a sales sheet first.</h5>
              <Puff width='100px'  style={{color: '#C14B4D'}}/>
              <br/>
              <Button onClick={() => this.props.ChangeView('import_sales_data')} style={{marginTop: '80px', backgroundColor: '#C14B4D', color: '#ffffff', border: 'none', borderRadius: '20px'}}>
                Click here to import sales data
              </Button>
          </div>
        );
      }

      return (
        <div>
            <Helmet>
              <title>Dashboard - Raw Data</title>
              {/* <meta name="description" content="" /> */}
            </Helmet>
            <br/>
            <h6 style={{fontWeight: 'bold'}}>Raw Data</h6>
            <br/><br/>
            <Row style={{marginRight: '0px', height: '450px', overflowY: 'scroll'}}>
              <ReactDataSheet
                data={raw_data}
                valueRenderer={cell => cell.value}
                onCellsChanged={changes => {
                  const raw_data = raw_data.map(row => [...row]);
                  changes.forEach(({ cell, row, col, value }) => {
                    raw_data[row][col] = { ...raw_data[row][col], value };
                  });
                  this.setState({ raw_data });
                }}
              />
            </Row>
        </div>
      );
    }

  };
  
  export default withCookies(RawData);