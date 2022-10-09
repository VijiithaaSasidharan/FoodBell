import React, { useState, useEffect }  from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell,  { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import { Link, Modal } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from "@mui/material/Container";
import { CssBaseline } from "@mui/material";
import HeaderVendor from "../components/Home/HeaderVendor";
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { createTheme } from '@mui/material/styles';


import axios from 'axios';

const themeCustom = createTheme({
    palette: {
      
      secondary: {
        // This is green.A700 as hex.
        main: '#D3D3D3',
      },
    },
  });

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:nth-of-type(even)': {
      backgroundColor: themeCustom.palette.secondary.main,
    },
  
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const tabstyle = {
    width: '90%',
    margin: "auto",
  };


  const errorStyle = {
    width: '100%',
    margin: '16px',
    textAlign: 'right',
    color: 'red',
  }

  const errorStyleDelivered = {
    width: '100%',
    margin: '16px',
    textAlign: 'right',
    color: 'red',
  }

  const scubscriptionHeading = {
    color: '#2d3436',
    padding: '12px',
    boxShadow: '0.5px 0.5px 0.5px lightgrey',
    fontSize: '2.5rem',
    fontFamily: 'ui-sans-serif',
  };

  const tableBoxShadow = {
    boxshadow : 'none',
    borderRadius : '20px !important',
  };

const tabrowbg = {
    backgroundColor: 'Orange',
    border: '1px solid #000',
  };

  const bgColorHome = {
    backgroundColor : '#b0d1e159',
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const tabrow = {
    border: '1px solid #000',
  };

  function rand() {
    return Math.round(Math.random() * 20) - 10;
  }
  
  function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
  }

function createData(name, username, email, phone, website) {
    return { name, username, email, phone, website };
   }

   const rows = [];
 
export default function VendorDashboard() {
    const [pendingOrders, setPendingOrders] = useState([]);
    // const [showPendingModal, setShowPendingModal] = useState(false);

    const [deliveredOrders, setDeliveredOrders] = useState([]);
    // const [showCompletedModal, setShowCompletedModal] = useState(false);


    // const handleClose = () => {
    //   setShowCompletedModal(false);
    //   setShowPendingModal(false);
    // }

    const profileData = JSON.parse(localStorage.getItem('__react_session__'));
    const payloadProfileData = profileData.profile.profile;
    const email = payloadProfileData.vendorEmail;

    function getPendingOrdersByVendorEmail(){
      axios
          .get(`http://localhost:8090/subscriptions/getPendingOrdersByVendorEmail/${email}`)
          .then((res) => {
            setPendingOrders(res.data);
            console.log('Result:', pendingOrders);
          })
          .catch((error) => {
            console.log(error);
          });
    }

    function getCompletedOrdersByVendorEmail(){
        axios
            .get(`http://localhost:8090/subscriptions/getCompletedOrdersByVendorEmail/${email}`)
            .then((res) => {
              setDeliveredOrders(res.data);
              console.log('Result:', deliveredOrders);
            })
            .catch((error) => {
              console.log(error);
            });
      }

    useEffect(() => {
        getPendingOrdersByVendorEmail();
        getCompletedOrdersByVendorEmail();
      }, []);
    

    const deliverSubscription = (e) => {
      axios
      .post(`http://localhost:8090/subscriptions/markDelivered/${e.target.id}`)
      .then((res) => {
        console.log('Result:', res);
        getPendingOrdersByVendorEmail();
        getCompletedOrdersByVendorEmail();
      })
      .catch((error) => {
        console.log(error);
      });
    }

    return (
      <div style={{backgroundColor: '#f5f5dc'}}>  
        <HeaderVendor />
    <div style={{marginTop: 60}} className="order-page">
      <Typography variant='h4' align='center' style={scubscriptionHeading}> PENDING ORDERS </Typography>
      <TableContainer style={tableBoxShadow} component={Paper}>
        <Table sx={{ minWidth: 700 }}  aria-label="customized table">
          <TableHead >
            <TableRow style={tabrowbg}>
              <StyledTableCell align='center'>Subscription Id</StyledTableCell>
              <StyledTableCell align='center'>Customer Email</StyledTableCell>
              <StyledTableCell align='center'>Start Date</StyledTableCell>
              <StyledTableCell align='center'>periodicity</StyledTableCell>
              <StyledTableCell align='center'></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingOrders.length != 0 && pendingOrders.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell align='center'>{row.subscriptionId}</StyledTableCell>
                <StyledTableCell align='center'>{row.customerEmail}</StyledTableCell>
                <StyledTableCell align='center'>{row.startDate}</StyledTableCell>
                <StyledTableCell align='center'>{row.periodicity}</StyledTableCell>
                <StyledTableCell  align='center'>  <Button id={row.subscriptionId} onClick={deliverSubscription} variant="contained"> DELIVERED </Button> </StyledTableCell>
              </StyledTableRow>
            ))}
            {
                pendingOrders.length == 0 && 
                    <Box style={errorStyle}>
                       THERE ARE NO PENDING ORDERS !! 
                    </Box>               
                
            }
          </TableBody>
        </Table>
      </TableContainer> 
        </div>
        <div>
        <Typography variant='h4' align='center' style={scubscriptionHeading}> COMPLETED ORDERS </Typography>
        <TableContainer style={tableBoxShadow} component={Paper}>
        <Table sx={{ minWidth: 700 }}  aria-label="customized table">
          <TableHead >
            <TableRow style={tabrowbg}>
              <StyledTableCell align='center'>Subscription Id</StyledTableCell>
              <StyledTableCell align='center'>Customer Email</StyledTableCell>
              <StyledTableCell align='center'>Start Date</StyledTableCell>
              <StyledTableCell align='center'>periodicity</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveredOrders.length != 0 && deliveredOrders.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell align='center'>{row.subscriptionId}</StyledTableCell>
                <StyledTableCell align='center'>{row.customerEmail}</StyledTableCell>
                <StyledTableCell align='center'>{row.startDate}</StyledTableCell>
                <StyledTableCell align='center'>{row.periodicity}</StyledTableCell>
              </StyledTableRow>
            ))}
            {
                deliveredOrders.length == 0 && 
                    <Box style={errorStyle}>
                       THERE ARE NO ORDERS AVAILABLE TO BE DELIVERED !! 
                    </Box>               
                
            }
          </TableBody>
        </Table>
      </TableContainer> 
        </div>
      </div>
    );
   }

