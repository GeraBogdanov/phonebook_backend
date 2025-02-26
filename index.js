const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

const app = express();
app.use(cors())
app.use(express.json());

app.use(morgan(`:method :url :status - :response-time ms`));
morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':body'))

let phonebook = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${phonebook.length} people <br/> ${Date()}</p>`
  );
});

app.get('/api/phonebook', (requset, response) => {
  response.json(phonebook);
});

app.get('/api/phonebook/:id', (request, response) => {
  const id = request.params.id;
  const person = phonebook.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(400).end();
  }
});

app.delete('/api/phonebook/:id', (request, response) => {
  const id = request.params.id;
  phonebook = phonebook.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return String(Math.floor(Math.random() * 1000));
};

app.post('/api/phonebook', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing',
    });
  }
  if (phonebook.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  phonebook = phonebook.concat(person);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
