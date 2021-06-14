import React, { Component, useReducer } from 'react';
import {Collapse, ImportSalesDataToggler,ImportSalesDataBrand,Nav,NavItem,NavLink,UncontrolledDropdown,
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

  class ImportSalesData extends Component{
    static propTypes = {
      cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) { 
      super(props);
      this.state = {
        excel_file: null,
        bottom_view: 'waiting'
      };

      this.UploadFile = (e) => {
        this.setState({[e.target.name]: e.target.files[0]})
      }

      this.HandleChange = (e) =>{
        this.setState({[e.target.name]: e.target.value});
      };

      this.GetRawData = () => {
        const { cookies } = this.props

        var data = new FormData() 
        data.append('user_access_token', cookies.get('token'))
        data.append('excel_file', this.state.excel_file)
        
        axios.post(Backend_Url + 'rawData', data)
        .then((res) => {
          let result = res.data
          this.props.SetRawData(result)
          console.log('Raw data set.', result)
        }).catch((error) => {
          console.log(error)
        })
      }

      this.SubmitData = () => {
        if(this.state.excel_file == null){
          alert('Your data input is required.')
        }else{
          this.setState({bottom_view: 'loading'})

          const { cookies } = this.props
  
          var data = new FormData() 
          data.append('user_access_token', cookies.get('token'))
          data.append('excel_file', this.state.excel_file)
          
          axios.post(Backend_Url + 'submitData', data)
          .then((res) => {
            let result = res.data
            this.props.SetAnalysisResults(result)
            this.GetRawData()
            this.setState({bottom_view: 'done'})
            alert('Analysis complete, you can now view the results in the analysis section.')
          }).catch((error) => {
            this.setState({bottom_view: 'waiting'})
            alert('Something went wrong, please try again.')
          })
        }
      }

      this.BottomView = () => {
        var current_view = this.state.bottom_view

        if(this.props.analysis_results != null){
          current_view = 'done'
        }

        if(current_view == 'waiting'){
          return<div>
            <h5>Waiting for your input</h5>
            <BallTriangle width='100px' style={{color: '#C14B4D'}}/>
          </div>
        }else if(current_view == 'loading'){
          return<div>
            <h5>Please wait while your data is being analysed.</h5>
            <Bars width='100px' style={{color: '#C14B4D'}}/>
          </div>
        }else if(current_view == 'done'){
          return<div>
            <h5>Analysis done, results are available in the analysis section.</h5>
            <Grid  width='100px' style={{color: '#C14B4D'}}/>
          </div>
        }
      }
    }

    componentDidMount() {

    }




    render() {
      return (
        <div>
            <Helmet>
              <title>Dashboard - Import Sales Data</title>
              {/* <meta name="description" content="" /> */}
            </Helmet>
            <br/>
            <h6 style={{fontWeight: 'bold'}}>Import Sales Data</h6>
            <br/><br/>
            <Row>
              <Col>
                <p>Upload Excel Sheet with Sales Data</p>
                <Input name='excel_file' onChange={this.UploadFile} type="file"
                  style={{backgroundColor: 'inherit', color: 'inherit'}}
                />
              </Col>
              <Col>
                <Button onClick={this.SubmitData} style={{marginTop: '40px', backgroundColor: '#C14B4D', color: '#ffffff', border: 'none', borderRadius: '20px'}}>
                  Submit for analysis
                </Button>
              </Col>
            </Row>
            <br/><br/><br/>
            <this.BottomView/>
        </div>
      );
    }

  };
  
  export default withCookies(ImportSalesData);