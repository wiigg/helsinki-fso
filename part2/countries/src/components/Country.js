const Country = ({ country, show }) => {
  if (!show || show[country.name.common]) {
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
          width="150"
        />
      </div>
    );
  }
};

export default Country;
