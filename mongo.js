const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
} else if (process.argv.length>2) {
  const password = process.argv[2]

  const url =
  //   `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true&w=majority`
    `mongodb+srv://fullstack:${password}@cluster0.qjipx.mongodb.net/part4?retryWrites=true`

  mongoose.connect(url)

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  const Person = mongoose.model('Person', personSchema)

  if (process.argv.length===3) {
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
  } else if (process.argv.length===5) {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })
    person.save()
      .then(() => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
      })
  }
}
