require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))



// mongoose-määrittelyt alkaa
// const mongoose = require('mongoose')
// const url =
//   // 'mongodb+srv://fullstack:<password>@cluster0-ostce.mongodb.net/note-app?retryWrites=true'
//   `mongodb+srv://fullstack:kRypCOsshYzDmaCf@cluster0.qjipx.mongodb.net/phonebook-app?retryWrites=true`

// mongoose.connect(url)

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

// personSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// const Person = mongoose.model('Person', personSchema)

// mongoose määrittelyt loppuu

morgan.token('person', (request, response) => {
    return JSON.stringify(request.body)
  })
  
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

let persons = [
  {
    id: 1,
    name: "Amira", 
    number: "098765",
  },
  {
    id: 2,
    name: "Elina", 
    number: "098765",
  },
  {
    id: 3,
    name: "Ensio", 
    number: "098765",
  },
]


app.get('/', (req, res) => {
    res.send('<h1>Hello world!</h1>')
})

app.get('/info', (req, res) => {
    const length = persons.length
    res.send(`Phonebook has info for ${length} people <br> ${new Date()}`)
})

// app.get('/api/persons', (req, res) => {
//     res.json(persons)
// })

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    // const maxId = persons.length > 0
    //     ? Math.max(...persons.map(p => p.id))
    //     : 0
    // return maxId +1
    return Math.floor(Math.random() * 100)
}

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)
    response.json(person)
})
  

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})