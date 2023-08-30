import {useState} from 'react'


export const TrackedLocationsTable = ({trackedLocations}) => {
    const [trackedData, setTrackedData] = useState(null)

    const getAllTrackedData = async () => {
        let allTrackedData = []
        for(let location of trackedLocations){
            // console.log(location)
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
        
    }

      return (

        
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">Your Tracked Locations</h5>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th scope='col'>Location</th>
                            <th scope='col'>AQI</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {trackedData && (trackedData.map(({name, aqi}, index) => (
                            <tr key={index}>
                                <td>{name}</td>
                                <td>{aqi}</td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>
            <button type="submit" onClick={getAllTrackedData}>Fetch Tracked Location Data</button>
        </div>
      )
}