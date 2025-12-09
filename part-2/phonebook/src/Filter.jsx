const Filter = ({ persons, search, handleSearch }) => {
  return (
    <>
      <form>
        <div>
          <label htmlFor="search">filter shown with</label>
          <input id="search" value={search} onChange={handleSearch} />
        </div>
      </form>

      <div>
        {persons.map((filtered) => (
          <p key={filtered.id + "-filtered"}>
            {filtered.name} {filtered.number}
          </p>
        ))}
      </div>
    </>
  );
};

export default Filter;
