import {useEffect} from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer } from "react-toastify";



export const TrackedLocationsTable = ({trackedData, getAllTrackedData, getCardColor, currentUser, setCurrentUser, isLoading, setIsLoading}) => {


    useEffect(() => {
        setIsLoading(true)
        getAllTrackedData()
    }, [currentUser.trackedLocations])
    
    const handleClick = async (e) => {
        if (isLoading) return;
        setIsLoading(true)
        console.log(trackedData)
        const selectedLocation = currentUser.trackedLocations[e]
        try{
            const response = await fetch("http://localhost:3000/editTrackedLocations", {
              method: "PUT",
              credentials: "include",
              body: JSON.stringify({
                currentLocation: selectedLocation
              }),
              headers: {
                "Content-Type": "application/json"
              }
            })
            const res = await response.json()
            console.log(res)
            setCurrentUser((u) => u = {
              ...currentUser,
              trackedLocations: res.trackedLocations
            })
          } catch(err){
            
            console.log(err)
          } 
    
    }

      return (

        
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">Your Tracked Locations</h5>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <table className='table table-bordered border-black'>
                        <thead>
                            <tr>
                                <th scope='col'>Location</th>
                                <th scope='col'>AQI</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {trackedData && (trackedData.map(({location, aqi}, index) => (
                                <tr  key={index}>
                                    <td className={getCardColor(aqi)} >{location}</td>
                                    <td className={getCardColor(aqi)}>{aqi} 
                                    <CloseIcon className="close-btn" fontSize="small" onClick={() => handleClick(index)} />
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                )}
                
            </div>
            <button type="submit" onClick={getAllTrackedData}>Fetch Tracked Location Data</button>
            <ToastContainer />
        </div>
      )
}