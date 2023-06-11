import './App.css';

//TODO: api  to offer potential misspelling corrects
//      D3 heatmap
//      redo in material UI
//      integrate testing 

const  getAirQuality = async (city) => {
  try{
    const response = await fetch(`https://api.waqi.info/feed/${city}/?token=${process.env.REACT_APP_AQI_API_TOKEN}`)
    const data = await response.json()
    console.log(data)
  }
  catch (error) {
    console.error(error)
    //set error state
    //set air quality data to null
  }
}

function App() {
  return (
   <h1>Hello, World!</h1>
  );
}

export default App;
