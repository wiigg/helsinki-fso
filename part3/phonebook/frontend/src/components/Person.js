const Person = ({ person, deletePerson }) => (
  <div>
    {person.name} {person.number}{" "}
    <button onClick={() => deletePerson(person.id)}>delete</button>
  </div>
);

export default Person;
