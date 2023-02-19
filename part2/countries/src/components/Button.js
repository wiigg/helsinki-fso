const Button = ({ country, show, handleShow }) => {
  return (
    <button onClick={() => handleShow(country)}>
      {show[country.name.common] ? "hide" : "show"}
    </button>
  );
};

export default Button;
