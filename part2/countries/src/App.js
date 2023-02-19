import { useState, useEffect } from "react";
import axios from "axios";

import Find from "./components/Find";
import Countries from "./components/Countries";

const App = () => {
  const [find, setFind] = useState("");
  const [countries, setCountries] = useState([]);

  const url = "https://restcountries.com/v3.1/all";

  // only retrieve data once
  useEffect(() => {
    axios.get(url).then((response) => {
      setCountries(response.data);
    });
  }, []);

  const handleFindChange = (event) => {
    setFind(event.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(find.toLowerCase())
  );

  return (
    <div>
      <Find find={find} handleFindChange={handleFindChange} />
      <Countries countries={filteredCountries} find={find} />
    </div>
  );
};

export default App;
