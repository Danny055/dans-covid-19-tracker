import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  //State = how to write a variable in REACT 
  //https://disease.sh/v3/covid-19/countries
  //USEEFFECT = Runs a piece of code based on given condition

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then (data => {
      setCountryInfo(data);
    });
  }, []);


  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,//United Stes, United Kingdom
          value: country.countryInfo.iso2// UK, USA
        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  }, []);


  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    

  const url = countryCode === 'worldwide' 
  ? 'https://disease.sh/v3/covid-19/all' 
  : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
  
  await fetch(url)
  .then((response) => response.json())
  .then((data) => {
    setCountry(countryCode);
    setCountryInfo(data);

    countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4)//TODO: Check this zoom
  });

  };



  return (
  <div className="app"> 
    <div className="app__left">

    {/*Header */} 
    {/*Title + Select input dropdown field */}
    <div className="app__header">
      <h1>COVID-19 TRACKER</h1>
    <FormControl className="app__dropdown">
      <Select onChange={onCountryChange} variant="outlined" value={country} >
         {/*Loop through all the countries using jsx and show in dropdown */}
         <MenuItem value="worldwide">Worldwide</MenuItem>
        {
          countries.map(country =>(
            <MenuItem value={country.value}>{country.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
    </div>
    
     {/*InfoBoxes */} 
    <div className="app__stats">
      {/*InfoBoxs Corona Virus cases */}
      <InfoBox 
      isRed
      active={casesType === "cases"}
      onClick={(e) => setCasesType("cases")}
      title= "Coronavirus cases" 
      cases={prettyPrintStat(countryInfo.todayCases)} 
      total={numeral(countryInfo.cases).format("0.0a")}/>
     
      {/*InfoBoxs Corona Virus recoveries */}
      <InfoBox 
      active={casesType === "recovered"}
      onClick={(e) => setCasesType("recovered")}
      title= "Recovered"  
      cases={prettyPrintStat(countryInfo.todayRecovered)} 
      total={numeral(countryInfo.recovered).format("0.0a")}/>
     
      {/*InfoBoxs Corona Virus Deaths */}
      <InfoBox
      isRed 
      active={casesType === "deaths"}
      onClick={(e) => setCasesType("deaths")}
      title= "Deaths"  
      cases={prettyPrintStat(countryInfo.todayDeaths)} 
      total={numeral(countryInfo.deaths).format("0.0a")}/>
    
    </div>

    {/*Map */}
    <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>


    </div>
    <Card className="app__right">
      <CardContent>
        <h3>Live Cases by Country</h3>
          {/*Table */}  
          <Table countries={tableData} />
        <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          {/*Graph */}
          <LineGraph className="app__graph" casesType={casesType}/>
      </CardContent>
    </Card>
  </div>
  );
}

export default App;
