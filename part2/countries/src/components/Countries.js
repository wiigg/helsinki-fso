const Countries = ({ countries, find }) => {
  if (find === "") {
    return <div></div>;
  }

  if (countries.length > 10) {
    return <div>too many matches. please narrow your search.</div>;
  }

  if (countries.length <= 10 && countries.length > 1) {
    return (
      <div>
        {countries.map((country) => (
          <div key={country.name.common}>{country.name.common}</div>
        ))}
      </div>
    );
  }

  if (countries.length === 1) {
    const country = countries[0];

    return (
      <div>
        <h1>{country.name.common}</h1>
        <div>capital: {country.capital}</div>
        <div>population: {country.population}</div>
        <div>area: {country.area}</div>
        <h2>languages</h2>
        <ul>
          {Object.values(country.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img
          src={country.flags.png}
          alt={`flag of ${country.name.common}`}
          width="100"
        />
      </div>
    );
  }
};

export default Countries;
