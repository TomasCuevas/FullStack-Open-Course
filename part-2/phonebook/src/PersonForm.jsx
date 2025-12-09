const PersonForm = ({
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  handleSubmitForm,
}) => {
  return (
    <>
      <form onSubmit={handleSubmitForm}>
        <div>
          <label htmlFor="name">name: </label>
          <input
            id="name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="number">number: </label>
          <input
            id="number"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default PersonForm;
