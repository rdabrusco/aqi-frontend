import { useState } from 'react'


const CitySearch = ({getAirQuality, getLocationByIp}) => {
    const [query, setQuery] = useState('')

    const handleChange = (e) => setQuery(e.target.value)

    const handleSubmit = (e) => {
        e.preventDefault()
        const formattedCity = query.replaceAll(' ', '-')
        console.log(formattedCity)
        getAirQuality(formattedCity)

    }

    const handleSubmitIp = (e) => {
        e.preventDefault()
        getLocationByIp()

    }

    return (
        <form onSubmit={handleSubmit} className='mb-4'>
            <input value={query} placeholder='Enter city...' className='form-control' onChange={handleChange} type="text"></input>
            <button type='submit' className='btn btn-primary mt-3'>Submit</button>
            <span className='mt-3'>Or</span>
            <button type='submit' onClick={handleSubmitIp} className='btn btn-primary mt-3'>Nearest Location</button>
        </form>
    )
}



export default CitySearch