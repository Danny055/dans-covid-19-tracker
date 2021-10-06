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

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');

  //State = how to write a variable in REACT 
  //https://disease.sh/v3/covid-19/countries
  //USEEFFECT = Runs a piece of code based on given condition

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,//United Stes, United Kingdom
          value: country.countryInfo.iso2// UK, USA
        }));
        setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);
  }

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
      <InfoBox title= "Coronavirus cases" cases={123} total={123}/>
     
      {/*InfoBoxs Corona Virus recoveries */}
      <InfoBox title= "Recovered"  cases={1231} total={1231} />
     
      {/*InfoBoxs Corona Virus Deaths */}
      <InfoBox title= "Deaths"  cases={131231} total={12312}/>
    
    </div>

    {/*Map */}
    <Map />
     

    </div>
    <Card className="app__right">
      <CardContent>
        <h3>Live Cases by Country</h3>
          {/*Table */}  

        <h3>Worldwide new Cases</h3>
          {/*Graph */}
      </CardContent>
    </Card>
  </div>
  );
}

export default App;
