const Find = ({ find, handleFindChange }) => {
  return (
    <div>
      find countries <input value={find} onChange={handleFindChange} />
    </div>
  );
};

export default Find;
