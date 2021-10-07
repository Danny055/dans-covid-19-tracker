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
import { sortData } from './util';
import LineGraph from "./LineGraph";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);



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
        setCountries(countries);
      });
    };
    getCountriesData();
  }, []);


  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    setCountry(countryCode);

  const url = countryCode === 'worldwide' 
  ? 'https://disease.sh/v3/covid-19/all' 
  : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
  
  await fetch(url)
  .then((response) => response.json())
  .then((data) => {
    setCountry(countryCode);
    setCountryInfo(data);
    });
  };



  return (
  <div className="app"> 
    <div className="app__left">

    {/*Header */} 
    {/*Title + Select input dropdown field */}
    <div className="app__header">
      <h1>COVID-19 Tracker</h1>
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
      <InfoBox title= "Coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
     
      {/*InfoBoxs Corona Virus recoveries */}
      <InfoBox title= "Recovered"  cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
     
      {/*InfoBoxs Corona Virus Deaths */}
      <InfoBox title= "Deaths"  cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
    
    </div>

    {/*Map */}
    <Map />
     

    </div>
    <Card className="app__right">
      <CardContent>
        <h3>Live Cases by Country</h3>
          {/*Table */}  
          <Table countries={tableData} />
        <h3>Worldwide new Cases</h3>
          {/*Graph */}
          <LineGraph />
      </CardContent>
    </Card>
  </div>
  );
}

export default App;
