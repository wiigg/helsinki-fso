import { useState } from "react";

import Country from "./Country";
import Button from "./Button";

const Countries = ({ countries, find }) => {
  const [show, setShow] = useState({});

  const handleShow = (country) => {
    const newShow = { ...show };
    newShow[country.name.common] = !newShow[country.name.common];
    setShow(newShow);
  };

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
          <div key={country.name.common}>
            {country.name.common}{" "}
            <Button
              country={country}
              show={show}
              handleShow={handleShow}
            />
            <Country country={country} show={show} />
          </div>
        ))}
      </div>
    );
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />;
  }
};

export default Countries;
