import { useState } from 'react' 
import CitySearch from './components/CitySearch';
import 'bootstrap/dist/css/bootstrap.min.css'
import { AirQualityCard } from './components/AirQuaiityChecker';
import { AirQualityLevelsTable } from './components/AirQualityLevelsTable'
import './App.css';
import { PollutantInfoCard } from './components/PollutantInfo';
import  {Map}  from './components/Map'

//TODO: api  to offer potential misspelling corrects
//      D3 heatmap
//      redo in material UI
//      integrate testing 
//      make accounts to save specific locations. if air quality worse than chosen point, send an email about air quality ONCE A DAY



function App() {

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

  const [error, setError] = useState(false)
  const [airQualityData, setAirQualityData] = useState(null)

  return (
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
    {/* only display this if airQualityData has been fetched */}
    {airQualityData && (
      <>
        <AirQualityCard data={airQualityData}/>
        <PollutantInfoCard pollutant={airQualityData.dominentpol} />
      </>
    )}
        <AirQualityLevelsTable />

   </div>
  );
}

export default App;
