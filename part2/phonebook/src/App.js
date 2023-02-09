import { useState, useEffect } from "react";
import personsService from "./services/persons";

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

const Person = ({ person, deletePerson }) => (
  <div>
    {person.name} {person.number}{" "}
    <button onClick={() => deletePerson(person.id)}>delete</button>
  </div>
);

const Persons = ({ personsToShow, deletePerson }) => (
  <div>
    {personsToShow.map((person) => (
      <Person key={person.name} person={person} deletePerson={deletePerson} />
    ))}
  </div>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personsService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

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

    const person = persons.find((person) => person.name === newName);

    if (person) {
      changeNumber(person.id);
      return;
    }

    const personObject = {
      id: persons.length + 1,
      name: newName,
      number: newPhone,
    };

    personsService.create(personObject).then((response) => {
      setPersons(persons.concat(response));
      setNewName("");
      setNewPhone("");
    });
  };

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);

    const confirm = window.confirm(`Delete ${person.name}?`);

    if (confirm) {
      personsService.remove(person.id).then((response) => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  const changeNumber = (id) => {
    const person = persons.find((person) => person.id === id);

    const confirm = window.confirm(`${person.name} is already in the phonebook, replace the old number with a new one?`);

    if (confirm) {
      const changedPerson = { ...person, number: newPhone };

      personsService.update(id, changedPerson).then((response) => {
        setPersons(persons.map((person) => person.id !== id ? person : response));
        setNewName("");
        setNewPhone("");
      });
    }
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
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
