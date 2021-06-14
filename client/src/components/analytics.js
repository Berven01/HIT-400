import React, { Component, useReducer } from 'react';
import {Collapse, AnalyticsToggler,AnalyticsBrand,Nav,NavItem,NavLink,UncontrolledDropdown,
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
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

  class Analytics extends Component{
    static propTypes = {
      cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) { 
      super(props);
      this.state = {
        branch: '',
        product: '',
        start_date: '',
        end_date: ''
      };

      this.HandleChange = (e) =>{
        this.setState({[e.target.name]: e.target.value});
      };

      this.SwitchBranch = (branch) => {
        this.setState({branch: branch})
      }
    }

    componentDidMount() {

    }




    render() {
      var analysis_results = this.props.analysis_results

      if(analysis_results == null){
        return (
          <div>
              <Helmet>
                <title>Dashboard - Analytics</title>
                {/* <meta name="description" content="" /> */}
              </Helmet>
              <br/>
              <h6 style={{fontWeight: 'bold'}}>Analytics</h6>
              <br/><br/><br/><br/>
              <h6>You need to import a sales sheet first.</h6>
              <Puff width='100px'  style={{color: '#C14B4D'}}/>
              <br/>
              <Button onClick={() => this.props.ChangeView('import_sales_data')} style={{marginTop: '80px', backgroundColor: '#C14B4D', color: '#ffffff', border: 'none', borderRadius: '20px'}}>
                Click here to import sales data
              </Button>
          </div>
        );
      }

      //  get branches
      var branches = new Set() // Create Set (stores only unique values)
      analysis_results.map((item, index) => {
        branches.add(item.branch)
      })
      branches = [...branches]

      var results_to_map = []
      var products = new Set()
      if(this.state.branch == 'all'){
        results_to_map = analysis_results
        // products
        results_to_map.map((item, index) => {
          products.add(item.product_line)
        })
        products = [...products]
      }else{
        results_to_map = analysis_results.filter(item => item.branch == this.state.branch)
        // products
        results_to_map.map((item, index) => {
          products.add(item.product_line)
        })
        products = [...products]
      }

      if(this.state.product != 'all'){
        results_to_map = results_to_map.filter(item => item.product_line == this.state.product)
      }

      // sort by date
      results_to_map = results_to_map.sort(function (a, b) {
        return a.value - b.value;
      });

      // get dates
      var dates = new Set()
      results_to_map.map((item, index) => {
        dates.add(item.date)
      })
      dates = [...dates]

      // 
      if((this.state.start_date != '') && (this.state.end_date != '')){
        results_to_map = results_to_map.filter(item => ((item.date >= this.state.start_date) && (item.date <= this.state.end_date)))
      }

      // 
      var sales_count = results_to_map.reduce((acc, sale) => acc + parseInt(sale.quantity), 0)
      var sales_amount = results_to_map.reduce((acc, sale) => acc + parseFloat(sale.total), 0)
      var gross_income = results_to_map.reduce((acc, sale) => acc + parseFloat(sale.gross_income), 0)
      var net_income = sales_amount - gross_income

      // 
      sales_amount = parseFloat(sales_amount).toFixed(2)
      gross_income = parseFloat(gross_income).toFixed(2)
      net_income = parseFloat(net_income).toFixed(2)

      // 
      var sales_time_object = {
        '00:00-02:00': 0,
        '02:00-04:00': 0,
        '04:00-06:00': 0,
        '06:00-08:00': 0,
        '08:00-10:00': 0,
        '10:00-12:00': 0,
        '12:00-14:00': 0,
        '14:00-16:00': 0,
        '16:00-18:00': 0,
        '18:00-20:00': 0,
        '20:00-22:00': 0,
        '22:00-00:00': 0
      }
      results_to_map.map((item, index) => {
        var time = item.time
        if((time >= '00:00') && (time < '02:00')){
          sales_time_object['00:00-02:00'] = sales_time_object['00:00-02:00'] + parseInt(item.quantity)
        }else if((time >= '02:00') && (time < '04:00')){
          sales_time_object['02:00-04:00'] = sales_time_object['02:00-04:00'] + parseInt(item.quantity)
        }else if((time >= '04:00') && (time < '06:00')){
          sales_time_object['04:00-06:00'] = sales_time_object['04:00-06:00'] + parseInt(item.quantity)
        }else if((time >= '06:00') && (time < '08:00')){
          sales_time_object['06:00-08:00'] = sales_time_object['06:00-08:00'] + parseInt(item.quantity)
        }else if((time >= '08:00') && (time < '10:00')){
          sales_time_object['08:00-10:00'] = sales_time_object['08:00-10:00'] + parseInt(item.quantity)
        }else if((time >= '10:00') && (time < '12:00')){
          sales_time_object['10:00-12:00'] = sales_time_object['10:00-12:00'] + parseInt(item.quantity)
        }else if((time >= '12:00') && (time < '14:00')){
          sales_time_object['12:00-14:00'] = sales_time_object['12:00-14:00'] + parseInt(item.quantity)
        }else if((time >= '14:00') && (time < '16:00')){
          sales_time_object['14:00-16:00'] = sales_time_object['14:00-16:00'] + parseInt(item.quantity)
        }else if((time >= '16:00') && (time < '18:00')){
          sales_time_object['16:00-18:00'] = sales_time_object['16:00-18:00'] + parseInt(item.quantity)
        }else if((time >= '18:00') && (time < '20:00')){
          sales_time_object['18:00-20:00'] = sales_time_object['18:00-20:00'] + parseInt(item.quantity)
        }else if((time >= '20:00') && (time < '22:00')){
          sales_time_object['20:00-22:00'] = sales_time_object['20:00-22:00'] + parseInt(item.quantity)
        }else if((time >= '22:00') && (time < '00:00')){
          sales_time_object['22:00-00:00'] = sales_time_object['22:00-00:00'] + parseInt(item.quantity)
        }
      })
      var keys = Object.keys(sales_time_object)
      var graph_data = []
      keys.forEach((key, index) => {
        var data = {
          'time': key,
          'quantity': sales_time_object[key]
        }
        graph_data.push(data)
      });

      // renderGraph = () => {
        
      // }

      return (
        <div>
            <Helmet>
              <title>Dashboard - Analytics</title>
              {/* <meta name="description" content="" /> */}
            </Helmet>
            <br/>
            <h6 style={{fontWeight: 'bold'}}>Analytics</h6>
            <br/><br/>
            <Row style={{textAlign: 'left'}}>
              <Col>
                Branch:
                <br/>
                <select name='branch' value={this.state.branch} type='text' onChange={this.HandleChange}
                  style={{border: 'none', borderBottom: '1px solid grey', width: '100%', backgroundColor: 'inherit', marginTop: '7px'}}>
                  <option value=''>Pick a Branch</option>
                  <option value='all'>All</option>
                  {branches.map((item, index) => {
                      return<option value={item}>{item}</option>
                  })}
                </select>
              </Col>
              <Col>
                Product:
                <br/>
                <select name='product' value={this.state.product} type='text' onChange={this.HandleChange}
                  style={{border: 'none', borderBottom: '1px solid grey', width: '100%', backgroundColor: 'inherit', marginTop: '7px'}}>
                  <option value=''>Pick a Product Line</option>
                  <option value='all'>All</option>
                  {products.map((item, index) => {
                      return<option value={item}>{item}</option>
                  })}
                </select>
              </Col>
              <Col>
                Start Date:
                <br/>
                <select name='start_date' value={this.state.start_date} type='text' onChange={this.HandleChange}
                  style={{border: 'none', borderBottom: '1px solid grey', width: '100%', backgroundColor: 'inherit', marginTop: '7px'}}>
                  <option value=''>Pick Start Date</option>
                  {dates.map((item, index) => {
                      return<option value={item}>{item}</option>
                  })}
                </select>
              </Col>
              <Col>
                End Date:
                <br/>
                <select name='end_date' value={this.state.end_date} type='text' onChange={this.HandleChange}
                  style={{border: 'none', borderBottom: '1px solid grey', width: '100%', backgroundColor: 'inherit', marginTop: '7px'}}>
                  <option value=''>Pick End Date</option>
                  {dates.map((item, index) => {
                      return<option value={item}>{item}</option>
                  })}
                </select>
              </Col>
            </Row>
            <br/><br/>
            <Row>
              <Col>
                  <div style={{backgroundColor: '#C14B4D', height: '150px', width: '150px', borderRadius: '50%'}}>
                    <div style={{margin: '3px', backgroundColor: '#E0DBDF', height: '145px', width: '145px', borderRadius: '50%'}}>
                        <br/><br/>
                        <h6>
                          {sales_count}
                        </h6>
                        Items Sold
                    </div>
                  </div>
              </Col>
              <Col>
                  <div style={{backgroundColor: '#C14B4D', height: '150px', width: '150px', borderRadius: '50%'}}>
                    <div style={{margin: '3px', backgroundColor: '#E0DBDF', height: '145px', width: '145px', borderRadius: '50%'}}>
                      <br/><br/>
                      <h6>
                        $ {sales_amount}
                      </h6>
                      In Sales
                    </div>
                  </div>
              </Col>
              <Col>
                  <div style={{backgroundColor: '#C14B4D', height: '150px', width: '150px', borderRadius: '50%'}}>
                    <div style={{margin: '3px', backgroundColor: '#E0DBDF', height: '145px', width: '145px', borderRadius: '50%'}}>
                      <br/><br/>
                      <h6>
                        $ {gross_income}
                      </h6>
                      Gross Income
                    </div>
                  </div>
              </Col>
              <Col>
                  <div style={{backgroundColor: '#C14B4D', height: '150px', width: '150px', borderRadius: '50%'}}>
                    <div style={{margin: '3px', backgroundColor: '#E0DBDF', height: '145px', width: '145px', borderRadius: '50%'}}>
                    <br/><br/>
                      <h6>
                        $ {net_income}
                      </h6>
                      Net Income
                    </div>
                  </div>
              </Col>
            </Row>
            <br/><br/>
            <h6 style={{fontWeight: 'bold'}}>
              Sales Time Chart
            </h6>
            <br/>
            <Row style={{marginRight: '0px', height: '400px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={graph_data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantity" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Row>
        </div>
      );
    }

  };
  
  export default withCookies(Analytics);