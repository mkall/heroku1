const express = require('express')
const morgan = require('morgan');
const cors = require('cors')
const app = express()

app.use(express.json()) 

morgan.token('post-body', function(req, res, param) {
  if( req.method == 'POST' ) {
    return JSON.stringify(req.body);
  } else {
    return ''
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'));
app.use(cors())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },  {
    id: 3,
    name: "Dan Adramov",
    number: "12-43-234345"
  },  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }]

  app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people\n\n${new Date().toLocaleDateString()}`)
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => p.id))
      : 0
    return maxId + 1
  }

  app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    } else if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }

    if( persons.find(p => p.name === body.name) ) {
      return response.status(400).json({ 
        error: `Contact ${body.name} already exists`
      })
    }

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
    
    persons = persons.concat(person)

    response.json(person)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => {
      return person.id === id
    })
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

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })