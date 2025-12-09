import { useEffect, useState } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import PersonServices from "./services/person";
import Notification from "./Notification";

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [personsFiltered, setPersonsFiltered] = useState([]);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    PersonServices.getAll().then((data) => setPersons(data));
  }, []);

  const handleSubmitForm = (event) => {
    event.preventDefault();

    const alreadyAdded = persons.find((person) => person.name === newName);
    if (alreadyAdded) {
      const confirmUpdate = confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      if (!confirmUpdate) return;

      PersonServices.update(alreadyAdded.id, {
        name: newName,
        number: newNumber,
      })
        .then((data) => {
          setPersons(
            persons.map((person) =>
              person.id === alreadyAdded.id ? data : person
            )
          );
          setMessage(`Updated number for ${newName}`);
        })
        .catch(() => {
          setErrorMessage(
            `Information of ${newName} has already been removed from server`
          );
        });
    } else {
      PersonServices.create({ name: newName, number: newNumber }).then(
        (data) => {
          setPersons([...persons, data]);
          setMessage(`Added ${newName}`);
        }
      );
    }

    setNewName("");
    setNewNumber("");

    setTimeout(() => {
      setMessage(null);
      setErrorMessage(null);
    }, 4000);
  };

  const handleSearch = (event) => {
    const newSearchValue = event.target.value;
    setSearch(newSearchValue);

    if (newSearchValue) {
      setPersonsFiltered(
        persons.filter((person) =>
          person.name.toLowerCase().includes(newSearchValue.toLowerCase())
        )
      );
    } else {
      setPersonsFiltered([]);
    }
  };

  const handleDeletePerson = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    const confirm = window.confirm(`Delete ${personToDelete.name}?`);
    if (!confirm) return;

    PersonServices.deletePerson(id).then(() => {
      setPersons(persons.filter((person) => person.id !== id));
    });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Notification message={errorMessage} error />
      <Filter
        persons={personsFiltered}
        search={search}
        handleSearch={handleSearch}
      />

      <h2>Add a new</h2>
      <PersonForm
        handleSubmitForm={handleSubmitForm}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h2>Numbers</h2>
      <Persons persons={persons} onDelete={handleDeletePerson} />
    </div>
  );
};

export default App;
