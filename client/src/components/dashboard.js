import React, { Component, useReducer } from 'react';
import {Collapse, DashboardToggler,DashboardBrand,Nav,NavItem,NavLink,UncontrolledDropdown,
 Button, Input, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, Container, Label, InputGroup} from "reactstrap";
import axios from 'axios';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import {Helmet} from 'react-helmet'
import {Backend_Url} from './backend_url'
import Background_Image from '../images/image_1.jpg'
import Logo from '../images/logos/logo.jpg'
import {CgImport} from 'react-icons/cg'
import {AiOutlineLineChart} from 'react-icons/ai'
import {CgNotes} from 'react-icons/cg'
import {BiUserCircle} from 'react-icons/bi'
import ImportSalesData from './import_sales_data'
import Analytics from './analytics'
import RawData from './raw_data'

  class Dashboard extends Component{
    static propTypes = {
      cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) { 
      super(props);
      this.state = {
        user_details: {},
        current_view: 'import_sales_data',
        dropdownOpen: false,
        analysis_results: null,
        raw_data: null
      };

      this.SetAnalysisResults = (results) => {
        this.setState({analysis_results: results})
      }

      this.SetRawData = (data) => {
        this.setState({raw_data: data})
      }

      this.Signout = () =>{
        const { cookies } = this.props;

        axios.get(Backend_Url + 'deactivateAccessToken/' + cookies.get('token'))
        .then(res => {
          cookies.remove('token', { path: '/' });
          let port = (window.location.port ? ':' + window.location.port : '');
          window.location.href = '//' + window.location.hostname + port + '/';
        })
        .catch((error) => {
          alert('A network error occured while trying to sign you out, please try again.')
        });
      };

      this.dtoggle = () => {
        this.setState(prevState => ({
          dropdownOpen2: !prevState.dropdownOpen
        }));
      }

      this.onMouseEnter = () => {
        this.setState({dropdownOpen: true});
      };
    
      this.onMouseLeave = () => {
        this.setState({dropdownOpen: false});
      };

      this.HandleChange = (e) =>{
        this.setState({[e.target.name]: e.target.value});
      };

      this.ChangeView = (selected_view) => {
        document.getElementById(this.state.current_view).style.color = '#ffffff'
        document.getElementById(selected_view).style.color = '#F2B027'

        this.setState({current_view: selected_view})
      }

      this.CurrentView = () => {
        var current_view = this.state.current_view

        if(current_view == 'import_sales_data'){
            return <ImportSalesData analysis_results={this.state.analysis_results} SetAnalysisResults={this.SetAnalysisResults} SetRawData={this.SetRawData}/>
        }else if(current_view == 'analytics'){
            return <Analytics analysis_results={this.state.analysis_results} ChangeView={this.ChangeView}/>
        }else if(current_view == 'raw_data'){
            return <RawData raw_data={this.state.raw_data} ChangeView={this.ChangeView}/>
        }else{
            return<div>
                <br/><br/>
                Something went wrong, please try again or reload the web page.
            </div>
        }
      }
    }

    componentDidMount() {
      document.getElementById(this.state.current_view).style.color = '#F2B027'

      const { cookies } = this.props;
      if(cookies.get('token')==null){
        let port = (window.location.port ? ':' + window.location.port : '');
        window.location.href = '//' + window.location.hostname + port + '/';
      }else{

        axios.get(Backend_Url + 'getUserDetailsByAccessToken/' + cookies.get('token'), { headers: { 'Bypass-Tunnel-Reminder': 'A&E-Client' }  })
        .then(res => {
          this.setState({
            user_details: res.data
          });
        })
        .catch((error) => {
          console.log(error);
        });
      }
    }




    render() {
      return (
        <div style={{backgroundImage: "url(" + Background_Image + ")"}}>
            <Helmet>
              <title>Dashboard</title>
              {/* <meta name="description" content="" /> */}
            </Helmet>
            <div style={{backgroundColor: '#E0DBDF', opacity: 0.9}}>
                <Row style={{marginRight: '0px'}}>
                    <Col sm='2' style={{minHeight: '630px', backgroundColor: '#F0453A', color: '#ffffff', textAlign: 'left'}}>
                        <Container style={{textAlign: 'left'}}>
                            <br/>
                            <img src={Logo} style={{width: '20%'}}/> Sales Analytics
                            <div style={{border: '1px solid #F2B027', marginTop: '5px'}}></div>
                            <br/>
                        </Container>
                        <Button id='import_sales_data' onClick={() => this.ChangeView('import_sales_data')} style={{textAlign: 'left', width: '100%', border: 'none', backgroundColor: 'inherit', color: 'inherit', outline: 'none', boxShadow: 'none'}}>
                            <CgImport /> Import Sales Data
                        </Button>
                        <br/>
                        <Button id='analytics' onClick={() => this.ChangeView('analytics')} style={{textAlign: 'left', width: '100%', border: 'none', backgroundColor: 'inherit', color: 'inherit', outline: 'none', boxShadow: 'none'}}>
                            <AiOutlineLineChart /> Analytics
                        </Button>
                        <br/>
                        <Button id='raw_data' onClick={() => this.ChangeView('raw_data')} style={{textAlign: 'left', width: '100%', border: 'none', backgroundColor: 'inherit', color: 'inherit', outline: 'none', boxShadow: 'none'}}>
                            <CgNotes color='#ffffff'/> Raw Data
                        </Button>
                        <br/>
                    </Col>
                    <Col>
                        <Row style={{textAlign: 'right', marginRight: '0px', backgroundColor: '#C14B4D', height: '60px'}}>
                            <Container style={{textAlign: 'right'}}>
                                <Dropdown className="d-inline-block" onMouseOver={this.onMouseEnter} onMouseLeave={this.onMouseLeave} isOpen={this.state.dropdownOpen} toggle={this.dtoggle}>
                                    <DropdownToggle  style={{marginTop: '', backgroundColor:  'inherit', border: 'none', fontSize: '10px', color: '#ffffff'}}>
                                        <BiUserCircle size='25px'/>
                                        <br/>
                                        <span style={{fontWeight: 'bold'}}>
                                          {this.state.user_details.firstname} {this.state.user_details.lastname}
                                        </span>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem  onClick={this.Signout}>
                                            <NavLink style={{color: '#F0453A', backgoundColor: 'inherit'}} >
                                                Signout
                                            </NavLink>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Container>
                        </Row>
                        <Row style={{marginRight: '0px'}}>
                            <Container>
                                <this.CurrentView/>
                            </Container>
                        </Row>
                    </Col>
                </Row>
            </div>
        </div>
      );
    }

  };
  
  export default withCookies(Dashboard);