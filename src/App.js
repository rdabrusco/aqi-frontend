import { useState } from 'react' 
import CitySearch from './components/CitySearch';
import 'bootstrap/dist/css/bootstrap.min.css'
import { AirQualityCard } from './components/AirQuaiityChecker';
import { AirQualityLevelsTable } from './components/AirQualityLevelsTable'
import './App.css';
import { PollutantInfoCard } from './components/PollutantInfo';

//TODO: api  to offer potential misspelling corrects
//      D3 heatmap
//      redo in material UI
//      integrate testing 



function App() {

  const  getAirQuality = async (city) => {
    try{
      const response = await fetch(`https://api.waqi.info/feed/${city}/?token=${process.env.REACT_APP_AQI_API_TOKEN}`)
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
    catch (error) {
      console.error(`network error: ${error}`)
      //set error state
      //set air quality data to null
    }
  }

  const [error, setError] = useState(false)
  const [airQualityData, setAirQualityData] = useState(null)

  return (
   <div className='container'>
    <h1 className='mt-5 mb-3'>Air Quality Index Checker</h1>
    <CitySearch getAirQuality={getAirQuality} />
    {error && (
      <div className='alert alert-danger'
      role='alert'>
        Uh oh, an error has occurred! Good luck!
      </div>
    )}
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
