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

    useEffect(() => {

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

        fetchHeatmapData().then((data) => {
            console.log('running')
            setMapData(data.slice(0, 100))
            // console.log(`mapData type: ${mapData}`)

        })

    })

       

        // const mapData = fetchHeatmapData()
        const testData = [
                [37.7749, -122.4194, 50],
                // [37.4419, -122.143, 30],
                // [38.5816, -121.4944, 10],
                // [37.6879, -122.47, 20],
                // [37.3688, -122.0363, 15],
                // [37.7749, -122.4194, 40],
                // [37.4419, -122.143, 25],
                // [38.5816, -121.4944, 8],
                // [37.6879, -122.47, 15],
                // [37.3688, -122.0363, 10],
              
                [51.505, -0.09, 0.1],
                [51.106, -0.08, 0.5],
                [51.507, -0.07, 0.3],
                [51.505, -0.09, 0.1],
                [51.508, -0.07, 0.2],
                [51.509, -0.06, 0.7],
                [51.507, -0.08, 0.4],
                [51.504, -0.07, 0.6],
                [51.503, -0.09, 0.3],
                [51.506, -0.06, 0.2],
              
                [40.7128, -74.006, 100],
                [34.0522, -118.2437, 80],
                [41.8781, -87.6298, 70],
                [29.7604, -95.3698, 60],
                [42.3601, -71.0589, 50],
                [32.7157, -117.1611, 40],
                [39.9526, -75.1652, 30],
                [33.4484, -112.074, 20],
                [47.6062, -122.3321, 10],
                [38.9072, -77.0369, 5],
              
                [19.076, 72.8777, 50], // Mumbai
                [19.041, 73.0777, 10], // Mumbai
                [19.066, 73.8077, 20], // Mumbai
                [19.076, 73.3077, 30], // Mumbai
                [28.7041, 77.1025, 40], // Delhi
                [12.9716, 77.5946, 30], // Bangalore
                [22.5726, 88.3639, 20], // Kolkata
                [13.0827, 80.2707, 10], // Chennai
                [26.9124, 75.7873, 5], // Jaipur
                [17.385, 78.4867, 5], // Hyderabad
                [22.7196, 75.8577, 2], // Indore
                [19.076, 72.8777, 3]
              
        ]

    return (
        
            <LeafletMap center={position} zoom={zoomLevel}>
                <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
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




























// export const Map = () => {
//     const mapRef = useRef(null)
    

//     useEffect(() => {
//         // Initialize the map when the component mounts
//         const position = [39.74, -105]
//         const zoomLevel = 13
        
    
//         // var map = L.map('map').setView(position, zoomLevel)

//         var baseLayer =  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         maxZoom: 19,
//         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'

//         })

     


//         const fetchHeatmapData = async () => {
//             const response = await fetch(`https://api.waqi.info/v2/map/bounds?latlng=19.5,-161.75583,64.85694,-68.01197&networks=all&token=${process.env.REACT_APP_AQI_API_TOKEN}`)
//             const data = await response.json()
//             const rawData = data.data
//             const mappedData = rawData.map(({lat, lon, aqi }) => ({lat, lon, aqi}))

//             console.log(`${mappedData}`)
//             // console.log(JSON.stringify(mappedData, null, 2));
//         }
    
//         fetchHeatmapData()

//         var cfg = {
//             "radius": 2,
//             "maxOpacity": .8,
//             "scaleRadius": true,
//             "useLocalExtrema": true,
//             latField: 'lat',
//             lonField: 'lon',
//             valueField: 'aqi'
//         }

//         var heatmapLayer = new HeatmapOverlay(cfg)

//         // L.heatmapLayer.addTo(map)

//         var map = new L.Map('map', {
//             center: position,
//             zoom: zoomLevel,
//             layers: [baseLayer, heatmapLayer]
//           });



//         return () => {
//             map.remove();
//           };

//     }, [])

//     return (
//         <div id='map'></div>
            
//     )
// }

