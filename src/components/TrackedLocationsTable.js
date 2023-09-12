import {useState, useEffect} from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from "react-toastify";



export const TrackedLocationsTable = ({trackedData, getAllTrackedData, getCardColor, setTrackedData, currentUser, setCurrentUser, isLoading, setIsLoading}) => {


    useEffect(() => {
        setIsLoading(true)
        getAllTrackedData()
    }, [currentUser.trackedLocations])
    
    const handleClick = async (e) => {
        if (isLoading) return;
        setIsLoading(true)
        // e.preventDefault()
        // const d = await tracked.find(item => item.name === e.target.parentNode.parentNode.childNodes[0].innerText)
        console.log(trackedData)
        const selectedLocation = currentUser.trackedLocations[e]
        try{
            const response = await fetch("http://localhost:8080/editTrackedLocations", {
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
            // getAllTrackedData((td) => td = res.trackedLocations)
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