// import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import DrawerAppBar from '../components/DrawerAppBar';


function Copyright(props) {
  const urlOrigin = window.location.origin
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href={urlOrigin}>
        AQI Checker
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp({currentUser, handleLogout,}) {
  const urlOrigin = window.location.origin
    const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const { password, confirmPassword } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });


 


  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget)

    if(password !== confirmPassword){
      handleError("Password and Confirm Password do not match")
      return;
    }

    if(password.length < 6){
      handleError("Please pick a password with at least 6 characters")
      return;
    }

    try {
      const res = await fetch(`${urlOrigin}/signup`, {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(data)),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const response = await res.json()
      const { success, message } = response;
      console.log(`success: ${success}, message: ${message}`)
      
      if(success){
        handleSuccess(message)
        setTimeout(() => {
          navigate("/")
        }, 1000)
      } else{
        handleError(message)
      }


        // server returned a status code other than 200-299 --> something went wrong
      if(!res.ok){
        console.log(res)
    }
    }
    
    catch (error) {
      // an error occured
      console.log(error)
  } 

}

  return (
    <ThemeProvider theme={defaultTheme}>
      <DrawerAppBar user={currentUser} handleLogout={handleLogout} />

      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>


              <Grid item xs={12}>
                <TextField
                  onChange={handleOnChange}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={handleOnChange}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={handleOnChange}
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirm-password"
                  autoComplete="confirm-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
}