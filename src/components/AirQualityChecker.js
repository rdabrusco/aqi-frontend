



export const AirQualityCard = ({data, getCardColor}) => {
  // destructuring data object into what is needed for the card
    const {aqi, city, dominentpol, time} = data
    const cardColor = getCardColor(aqi)
    return (
        <div className={`card mb-4 ${cardColor}`}>
            <div className="card-body">
                <h5 className='card-title'>{city.name}</h5>
                <h6 className='card-subtitle mb-2'>Air Quality Index: {aqi}</h6>
                <p className='card-text'>Dominant Pollutant: {dominentpol}</p>
                <p className='card-text'>Last Updated: {time.s}</p>
            </div>
           
        </div>
    )
}

