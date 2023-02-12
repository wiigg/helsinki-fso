const Filter = ({ filter, handleFilter }) => (
  <div>
    filter: <input value={filter} onChange={handleFilter} />
  </div>
);

export default Filter;
