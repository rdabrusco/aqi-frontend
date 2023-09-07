import { useState } from 'react'


const CitySearch = ({getAirQuality, getLocationByIp}) => {
    // state for search item
    const [query, setQuery] = useState('')

    const handleChange = (e) => setQuery(e.target.value)

    const handleSubmit = (e) => {
        e.preventDefault()
        // remove all spaces in query with dashes, since spaces not supported
        // by API
        const formattedCity = query.replaceAll(' ', '-')
        console.log(formattedCity)
        // runs search API call
        getAirQuality(formattedCity)

    }

    const handleSubmitIp = (e) => {
        e.preventDefault()
        // runs location api call
        getLocationByIp()

    }

    return (
        <form onSubmit={handleSubmit} className='mb-4'>
            <input value={query} placeholder='Enter city...' className='form-control' onChange={handleChange} type="text"></input>
            <div className='w-auto flex space-around'>
                <button type='submit' className='btn btn-primary mt-3 w-25'>Submit</button>
                <span className='mt-3 w-25 text-center'>Or</span>
                <button type='submit' onClick={handleSubmitIp} className='btn btn-primary mt-3 w-25'>Nearest Location</button>
            </div>
            
        </form>
    )
}



export default CitySearch