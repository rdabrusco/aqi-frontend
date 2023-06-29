// import L from 'leaflet'
// import heatmap from 'heatmap.js'
// import { HeatmapOverlay } from '../plugins/leaflet-heatmap'
// import { useEffect, useRef } from 'react'


import {useEffect, useState} from 'react'
import {MapContainer as LeafletMap, TileLayer, } from "react-leaflet"
import {HeatmapLayer} from "react-leaflet-heatmap-layer-v3"



export const Map = () => {
    const position = [39.74, -105]
    const zoomLevel = 13
    const [mapData, setMapData] = useState([])

    const fetchHeatmapData = async () => {
        const response = await fetch(`https://api.waqi.info/v2/map/bounds?latlng=19.5,-161.75583,64.85694,-68.01197&networks=all&token=${process.env.REACT_APP_AQI_API_TOKEN}`)
        const data = await response.json()
        const rawData = data.data
        const mappedData = rawData.map(({lat, lon, aqi }) => ({lat, lon, aqi}))
        const actualData = mappedData.map(i => {
            // return ({
            //     lat: i.lat,
            //     lon: i.lon,
            //     aqi: +i.aqi
            // })
            return [i.lat, i.lon, +i.aqi]
        })
        // console.log(`${actualData}`)
        // console.log(JSON.stringify(actualData, null, 2));
        // const finalData = JSON.stringify(actualData, null, 2);
        // console.log(typeof actualData)


        return actualData
    }

    useEffect(() => {

        

        fetchHeatmapData().then((data) => {
            console.log('running')
            setMapData(data.slice(0, 100))
            // console.log(`mapData type: ${mapData}`)

        })

    }, [])


    return (
        
            <LeafletMap center={position} zoom={zoomLevel}>
                <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
            max={1000}
            points={mapData}
            longitudeExtractor={m => m[1]}
            latitudeExtractor={m => m[0]}
            intensityExtractor={m => parseFloat(m[2]/1000)}
            gradient={{
                .05: 'green',
                .1: 'yellow',
                .15: 'orange',
                .2: 'red',
                .3: 'purple',
                1: 'darkred'

            }}
                />
                <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />
            </LeafletMap>
        
        
    )
}

