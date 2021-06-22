import React , {useState , useEffect} from "react";
import { FormControl, MenuItem, Select,Card , CardContent} from "@material-ui/core";
import './App.css';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import {sortData , prettyPrintStat} from "./utils";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";





function App() {

  const [countries, setCountries] = useState([]);
  const [country , setCountry] = useState('worldwide');
  const [countryInfo , setcountryInfo] = useState({});
  const [tableData , settableData] = useState([]);
  const [mapCenter, setmapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setmapZoom] = useState(3);
  const [mapCountries, setmapCountries] = useState([]);
  const [caseType, setcaseType] = useState("cases");

  useEffect(() => {

        fetch("https://disease.sh/v3/covid-19/all")
        .then(response => response.json())
        .then(data =>{
              setcountryInfo(data);
        });
  },[]);

  

  useEffect(() => {
      
       const getCountriesData = async () =>{
           await fetch("https://disease.sh/v3/covid-19/countries")
           .then((response) => response.json())
           .then((data) => {
             
                 const countries  = data.map((country) => ({
                      name : country.country,
                      value : country.countryInfo.iso2,
                    }));


                 const sortedData = sortData(data);
                 settableData(sortedData);
                 setmapCountries(data);
                 setCountries(countries);
           });
       };
       getCountriesData();
  }, []);

  const onCountryChange = async(event) => {

       const countryCode = event.target.value;
       
      

       const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`
        
       await fetch(url)
       .then(response => response.json())
       .then(data =>{
             
             setCountry(countryCode);
             setcountryInfo(data);
             countryCode === 'worldwide' ?setmapCenter({ lat: 34.80746, lng: -40.4796 })  : setmapCenter([data.countryInfo.lat , data.countryInfo.long]);
            //  setmapCenter([data.countryInfo.lat , data.countryInfo.long]);
             setmapZoom(4);

       });
  };

   console.log("Country info : ", countryInfo);

  return (
    <div className="app">

      <div className="app__left">
         
        <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        
         <FormControl className="app__dropdown">

             <Select variant="outlined" onChange={onCountryChange} value={country}>
               
               <MenuItem value="worldwide">Worldwide</MenuItem>  
              {countries.map((country)=> (
                  
                  <MenuItem value={country.value}>{country.name}</MenuItem>  
              ))}
                

             </Select>

         </FormControl>
         </div>
         <div className="app__stats">
             <InfoBox isRed active={caseType == "cases"} onClick={(e) => setcaseType("cases")} title="Corona Virus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total ={prettyPrintStat(countryInfo.cases)}></InfoBox>
             <InfoBox  active={caseType == "recovered"} onClick={(e) => setcaseType("recovered")} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total ={prettyPrintStat(countryInfo.recovered)}></InfoBox>
             <InfoBox isRed active={caseType == "deaths"} onClick={(e) => setcaseType("deaths")} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total ={prettyPrintStat(countryInfo.deaths)}></InfoBox>
         </div>
         
         <Map
              
             countries = {mapCountries}
             center = {mapCenter}
             zoom = {mapZoom}
             caseType = {caseType}
         />

      </div>
      <div className="app__right"></div>
         <Card >
            <CardContent>
                <h3>Live Cases by country</h3>
                <Table countries={tableData}/>
                <h3 className="Chart_title">Worldwide new {caseType}</h3>
                <LineGraph className="app__graph" caseType = {caseType}/>
            </CardContent>
         </Card>
    </div>
    
  );
}

export default App;
