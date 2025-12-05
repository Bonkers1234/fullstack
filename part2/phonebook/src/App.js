
import { useState, useEffect } from "react"
import serverCom from './services/service'

const Entry = ({person, deletePhone}) => {
  return (
    <div>
      {person.name} {person.number} 
      <span>   </span>
      <button onClick={() => deletePhone(person)}>Delete</button>
    </div>
  )
}

const Filter = ({handleChange}) => {
  return (
    <div>
      filter shown with <input onChange={handleChange}/>
    </div>
  )
}
 
const PersonForm = ({handleSubmit, value1, handleInputName, value2, handleInputNumber}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={value1} onChange={handleInputName}/>
      </div>
      <div>
        number: <input value={value2} onChange={handleInputNumber}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({persons, nameFilter, deletePhone}) => {
  return (
    persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()))
      .map(person => <Entry key={person.name} person={person} deletePhone={deletePhone}/>)
  )
}

const Notification = ({message}) => {
  if (message === null) {
    return null
  }

  return (
    <div className={message.className}>
      {message.text}
    </div>
  )
}

const App = () => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [persons, setPersons] = useState([]) 
  const [message, setMessage] = useState(null)

  useEffect(() => {
    serverCom.getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])


  const checkName = (object) => {
    if (persons.filter(person => person.name.toLowerCase() === object.name.toLowerCase()).length === 0) {
      serverCom.addPhone(object)
        .then(response => {
          const message = { 
            text: `${response.name} added to phonebook`, 
            className: 'success' 
          }
          setMessage(message)
          setTimeout(() => {
            setMessage(null)
          }, 4000);
          setPersons(persons.concat(response))
        })
        .catch(error => {
          const message = {
            text: `${error.response.data.error}`,
            className: 'failure'
          }
          setMessage(message)
          setTimeout(() => {
            setMessage(null)
          }, 4000);
        })
      setNewName('')
      setNewNumber('')
    } else {
      if (window.confirm(`${object.name} is already added to the phonebook, replace the old number with new one?`)) {
        const newContact = persons.find(person => person.name === object.name)
        const changedContact = { ...newContact, number: object.number }

        serverCom.updatePhone(changedContact.id, changedContact).then(updatedContact => {
          const message = { 
            text: `Number for ${updatedContact.name} changed from ${newContact.number} to ${updatedContact.number}`, 
            className: 'success' 
          }
          setMessage(message)
          setTimeout(() => {
            setMessage(null)
          }, 4000);
          setPersons(persons.map(person => person.id !== updatedContact.id ? person : updatedContact))
        })
        .catch(error => {
          const message = {
            text: `${error.response.data.error}`,
            className: 'failure'
          }
          setMessage(message)
          setTimeout(() => {
            setMessage(null)
          }, 4000);
        })
      }
      setNewName('')
      setNewNumber('')
    } 
  }

  const addNewName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }

    checkName(nameObject)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const filterName = (event) => {
    setNameFilter(event.target.value)
  }

  const deletePhone = (contact) => {
    if (window.confirm(`Delete ${contact.name}?`)) {
      serverCom.deletePhoneNum(contact.id)
        .then(response => {
          const message = {
            text: `${contact.name} has been removed from phonebook`,
            className: 'success'
          }
          setMessage(message)
          setTimeout(() => {
            setMessage(null)
          }, 4000);
          setPersons(persons.filter(person => person.id !== contact.id))
    })}
  }

  return (
    <div>
      <h2>Phonebook</h2> 
      <Notification message={message} />
      <Filter handleChange={filterName} />
      <h2>add a new number</h2>
      <PersonForm 
        handleSubmit={addNewName} 
        value1={newName}
        handleInputName={handleNameChange}
        value2={newNumber}
        handleInputNumber={handleNumberChange}  
      />
      <h2>Numbers</h2>
      <Persons persons={persons} nameFilter={nameFilter} deletePhone={deletePhone} />
    </div>
  )
}

export default App