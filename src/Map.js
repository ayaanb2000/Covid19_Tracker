import React from 'react';
import "./Map.css";
import {MapContainer as LeafletMap , TileLayer} from "react-leaflet";
import { showDataOnMap } from './utils';

function Map({countries ,caseType , center , zoom}) {
    console.log("This is center"+center);
    console.log("This is zoom"+zoom);
    console.log("This is case type"+caseType);
    return (
       
        <div className="map">
             
             <LeafletMap center={center} zoom={zoom}>

                  <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  
                  />

                 {showDataOnMap(countries , caseType)} 
             </LeafletMap>
        </div>
    );
}

export default Map
