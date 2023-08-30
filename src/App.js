import { useState, useEffect } from 'react' 
import { useCookies } from "react-cookie";
import CitySearch from './components/CitySearch';
import 'bootstrap/dist/css/bootstrap.min.css'
import { AirQualityCard } from './components/AirQuaiityChecker';
import { AirQualityLevelsTable } from './components/AirQualityLevelsTable'
import { TrackedLocationsTable } from './components/TrackedLocationsTable'
import './App.css';
import { PollutantInfoCard } from './components/PollutantInfo';
import { Link, useNavigate } from 'react-router-dom'
import  UserComponent  from './components/UserComponent'
import { ToastContainer, toast } from "react-toastify";

// import  {Map}  from './components/Map'

//TODO: api  to offer potential misspelling corrects
//      D3 heatmap or reinstall and fix react-leaflet-heatmap-layer-v3
//      redo in material UI
//      integrate testing 
//      make accounts to save specific locations. if air quality worse than chosen point, send an email about air quality ONCE A DAY




function App() {


  const [error, setError] = useState(false)
  const [airQualityData, setAirQualityData] = useState(null)

  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const verifyCookie = async () => {
      // if (!cookies.token) {
      //   navigate("/login");
      // }
      // const { data } = await axios.post(
      //   "http://localhost:4000",
      //   {},
      //   { withCredentials: true }
      // );
      console.log(`cookie: ${cookies.token}`)
      const data = await fetch("http://localhost:8080/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cookies.token}` 
        }
      })
      const resolvedData = await data.json()
      console.log(resolvedData)
      const { status, user } = resolvedData;
      console.log(`data: ${data}, status: ${status}, user: ${user}`)
      console.log(user.trackedLocations)
      setCurrentUser(user);
      // return status
      //   ? toast(`Hello ${user}`, {
      //       position: "top-right",
      //     })
      //   : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const getLocationByIp = async () => {
    const response = await fetch(`https://api.waqi.info/feed/here/?token=${process.env.REACT_APP_AQI_API_TOKEN}`)
    const data = await response.json()
    console.log(data)
    if(response.ok && data.status === 'ok'){
      setAirQualityData(data.data)
      setError(false)
    }else{
      setError(true)
      setAirQualityData(null)
    }
  }

  const  getAirQuality = async (city) => {
    try{
      const response = await fetch(`https://api.waqi.info/feed/${city}/?token=${process.env.REACT_APP_AQI_API_TOKEN}`)
      const data = await response.json()
      console.log(data)
      if(response.ok && data.status === 'ok'){
        // updates airQualityData state and error state
        setAirQualityData(data.data)
        setError(false)
      }else{
        setError(true)
        setAirQualityData(null)
      }
    }
    catch (error) {
      console.error(`network error: ${error}`)
      //set error state
      setError(true)
      //set air quality data to null
      setAirQualityData(null)
    }
  }

  const Logout = () => {
    removeCookie("token");
    navigate("/login");
  };

    const handleLogout = async () => {
      removeCookie("token")
      navigate("/login")
      // try{
      //   const response = await fetch("http://localhost:8080/logout")
      //   const data = await response.json()
      //   console.log(data)
      //   if(response.ok && data.status === 'ok'){
      //     setAirQualityData(data.data)
      //     setError(false)
      //   }else{
      //     setError(true)
      //     setAirQualityData(null)
      //   }
      // }catch(err) {
      //   console.error(`network error: ${error}`)
      //   //set error state
      //   setError(true)
      //   //set air quality data to null
      //   setAirQualityData(null)
      // }
    }
    
    const addCurrentLocation = async (e) => {
      e.preventDefault()
      const currentLocation = {
        name: airQualityData.city.name,
        lat: airQualityData.city.geo[0],
        lon: airQualityData.city.geo[1]
      }
      console.log(currentLocation)
      try{
        const response = await fetch("http://localhost:8080/editTrackedLocations", {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({
            currentLocation: currentLocation
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
        const res = await response.json()
        console.log(res)
        setCurrentUser({
          ...currentUser,
          trackedLocations: res.trackedLocations
        })
      } catch(err){
        console.log(err)
      }

    }

    function updateArray(arrays, newArray) {
      const exists = arrays.some(array => JSON.stringify(array) === JSON.stringify(newArray));
    
      if (exists) {
        console.log(`location already in array removing location`)
        return arrays.filter(array => JSON.stringify(array) !== JSON.stringify(newArray));
      } else {
        console.log(`location not in array, adding location`)
        return [].concat(arrays,[newArray]);
      }
    }

    const handleMe = async () => {
      try{
        const response = await fetch("http://localhost:8080/")
        const data = await response.json()
        console.log(data)
        if(response.ok && data.status === 'ok'){
          setAirQualityData(data.data)
          setError(false)
        }else{
          setError(true)
          setAirQualityData(null)
        }
      }catch(err) {
        console.error(`network error: ${error}`)
        //set error state
        setError(true)
        //set air quality data to null
        setAirQualityData(null)
      }
    } 

  





  return (
   <div className='container'>
    {/* <UserComponent /> */}
    <button type='submit' onClick={handleLogout} className='btn btn-primary mt-3 w-10'>Logout</button>
    <button type='submit' onClick={handleLogout} className='btn btn-primary mt-3 w-10'>Me</button>
    <Link to={`/login`}>Login</Link>
    <Link to={`/signup`}>Sign Up</Link>
    <a href={"http://"}></a>

    {/* Currently not implemented, issues with gradient always being maximum, and disappearing on scroll */}
    {/* <Map/> */}
    <h1 className='mt-5 mb-3'>Air Quality Index Checker</h1>
    <CitySearch getLocationByIp={getLocationByIp} getAirQuality={getAirQuality} />
    {error && (
      <div className='alert alert-danger'
      role='alert'>
        Uh oh, an error has occurred! Good luck!
      </div>
    )}
    {/* only display this if airQualityData has been fetched */}
    {airQualityData && (
      <>
        {currentUser && (
          <button type="submit" onClick={addCurrentLocation}>{currentUser.trackedLocations.some(array => array.name === (airQualityData.city.name)) ? "Remove" : "Save"} Current location</button>
        )}
        
        <AirQualityCard data={airQualityData}/>
        <PollutantInfoCard pollutant={airQualityData.dominentpol} />
        <TrackedLocationsTable trackedLocations={currentUser.trackedLocations} />
      </>
    )}
        <AirQualityLevelsTable />
    <ToastContainer />
   </div>
  );

}
export default App;
