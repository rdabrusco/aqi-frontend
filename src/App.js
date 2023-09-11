import { useState, useEffect } from 'react' 
import { useCookies } from "react-cookie";
import CitySearch from './components/CitySearch';
import 'bootstrap/dist/css/bootstrap.min.css'
import { AirQualityCard } from './components/AirQualityChecker';
import { AirQualityLevelsTable } from './components/AirQualityLevelsTable'
import { TrackedLocationsTable } from './components/TrackedLocationsTable'
import './App.css';
import { PollutantInfoCard } from './components/PollutantInfo';
import { Link, useNavigate } from 'react-router-dom'
import  UserComponent  from './components/UserComponent'
import { ToastContainer, toast } from "react-toastify";
import PersistentDrawerLeft from './components/AppBar';
import DrawerAppBar from './components/DrawerAppBar';

// import  {Map}  from './components/Map'

//TODO: api  to offer potential misspelling corrects
//      D3 heatmap or reinstall and fix react-leaflet-heatmap-layer-v3
//      redo in material UI
//      integrate testing 
//      make accounts to save specific locations. if air quality worse than chosen point, send an email about air quality ONCE A DAY




function App() {


  const [error, setError] = useState(false)
  const [airQualityData, setAirQualityData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, setIsPending] = useState(false)



  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const verifyCookie = async () => {
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
      if(user){
      console.log(user.trackedLocations)
      }
      setCurrentUser(user);
      return status
        ? toast(`Hello ${user.email}`, {
            position: "top-right",
          })
        : (removeCookie("token"));
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

    const handleLogout = async () => {
      removeCookie("token")
      navigate("/login")
    }

    
    
    const addCurrentLocation = async (e) => {
      e.preventDefault()
      if(airQualityData) {
        var currentLocation = {
          name: airQualityData.city.name,
          lat: airQualityData.city.geo[0],
          lon: airQualityData.city.geo[1]
        }
      }
      //  else if(trackedData) {
      //   var currentLocation = {
      //     name: trackedData.name,
      //     lat: trackedData.lat,
      //     lon: trackedData.lon
      //   }
      // }
      
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
        toast(`Successfully updated tracked locations`, {
          position: "bottom-left",
        })
      } catch(err){
        console.log(err)
      }

    }

    const updateSendEmail = async () => {
      try{
        const response = await fetch("http://localhost:8080/updateSendEmail", {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({
            sendEmail: currentUser.sendEmail
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
        const res = await response.json()
        console.log(res)
        setCurrentUser({
          ...currentUser,
          sendEmail: res.sendEmail
        })

        toast(`Successfully updated email alert preference`, {
          position: "bottom-left",
        })
        
      } catch(err){
        console.log(err)
      }
    }

    const handleChange = async () => {

      // setIsPending(true)
      await updateSendEmail()
      // setIsPending(false)
      

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


    const getCardColor = (aqi) => {
      // sets the card background color based off of the aqi 
        if (aqi <= 50) {
          return 'bg-success text-white';
        } else if (aqi <= 100) {
          return 'bg-warning';
        } else if (aqi <= 150) {
          return 'bg-orange';
        } else if (aqi <= 200) {
          return 'bg-danger text-white';
        } else if (aqi <= 300) {
          return 'bg-very-unhealthy text-white';
        } else {
          return 'bg-hazardous ';
        }
      }

    const [trackedData, setTrackedData] = useState(null)

    const getAllTrackedData = async () => {
        let allTrackedData = []
        console.log(`testing getting all tracked data`)
        console.log(currentUser.trackedLocations)
        for(let location of currentUser.trackedLocations){
            console.log(location)
            try{
                const response = await fetch(`https://api.waqi.info/feed/geo:${location.lat};${location.lon}/?token=${process.env.REACT_APP_AQI_API_TOKEN}`)
                const data = await response.json()
                console.log(data)
                allTrackedData.push({
                    name: location.name,
                    aqi: data.data.aqi
                })
            } catch(err){
                console.log(err)
            }
        }

        setTrackedData(allTrackedData)
        setIsLoading(false)
        
    }



  





  return (
  <>
   <DrawerAppBar user={currentUser} handleLogout={handleLogout} />
   <div className='container'>


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
    {currentUser && airQualityData && (
          <button type="submit" onClick={addCurrentLocation}>{airQualityData && currentUser.trackedLocations.some(array => array.name === (airQualityData.city.name)) ? "Remove" : "Save"} Current location</button>
        )}
    {/* only display this if airQualityData has been fetched */}
    {airQualityData && (
      <>
        
        
        <AirQualityCard getCardColor={getCardColor} data={airQualityData}/>
        <PollutantInfoCard pollutant={airQualityData.dominentpol} />
        
      </>
    )}

    {currentUser && (
      <>
       <input type="checkbox" name="sendEmail" checked={currentUser.sendEmail} onChange={handleChange} disabled={isPending} />
       <label htmlFor="sendEmail">Send Email Updates?</label>
      
       <TrackedLocationsTable trackedData={trackedData} setTrackedData={setTrackedData} getAllTrackedData={getAllTrackedData} getCardColor={getCardColor} addCurrentLocation={addCurrentLocation} currentUser={currentUser} setCurrentUser={setCurrentUser} isLoading={isLoading} setIsLoading={setIsLoading} />
      </>
     
    )}
        <AirQualityLevelsTable />
    <ToastContainer />
   </div>
  </>
  
  );

}
export default App;
