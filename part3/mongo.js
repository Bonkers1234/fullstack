
const mongoose = require('mongoose')

const display = () => {
  console.log('Usage for registering: "node mongo.js <password> <person_name> <number>"')
  console.log('Usage for listing: "node mongo.js <password>"')
  process.exit(1)
}

if (process.argv.length < 3) {
  display()
}

const password = process.argv[2]

const url =
    `mongodb+srv://fimerol604:${password}@cluster0.qyntazu.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', phonebookSchema)

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  display()
}










