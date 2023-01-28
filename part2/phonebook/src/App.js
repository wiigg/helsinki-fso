import { useState, useEffect } from "react";
import axios from "axios";

const Filter = ({ filter, handleFilter }) => (
  <div>
    filter: <input value={filter} onChange={handleFilter} />
  </div>
);

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newPhone,
  handlePhoneChange,
}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newPhone} onChange={handlePhoneChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Person = ({ person }) => (
  <div>
    {person.name} {person.number}
  </div>
);

const Persons = ({ personsToShow }) => (
  <div>
    {personsToShow.map((person) => (
      <Person key={person.name} person={person} />
    ))}
  </div>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
    .get('http://localhost:3001/persons')
    .then(response => {setPersons(response.data)})
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already in the phonebook`);
      return;
    }

    const personObject = {
      id: persons.length + 1,
      name: newName,
      number: newPhone,
    };

    setPersons(persons.concat(personObject));
    setNewName("");
    setNewPhone("");
  };

  const personsToShow = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilter={handleFilter} />

      <h2>Add New</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newPhone={newPhone}
        handlePhoneChange={handlePhoneChange}
      />

      <h2>Directory</h2>
      <Persons personsToShow={personsToShow} />
    </div>
  );
};

export default App;
