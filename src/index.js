import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import errorHandler from './errorHandler.js';
import Phone from './models/persons.js';
import connectToDB from './mongo.js';

const app = express();

morgan.token('body', (req) => {
  const arr = Object.values(req.body);
  if (arr.length > 0) {
    return JSON.stringify(req.body);
  }
});

// Middleware order
app.use(express.static('build')); // Serving static files from the backend
app.use(express.json());
app.use(
  morgan(':method :url :status :response-time ms - :res[content-length] :body')
);
app.use(cors());

connectToDB();

app.post('/api/phonebook', (request, response, next) => {
  const body = request.body;
  const { name, number } = body;

  if (!name || !number) {
    return response.status(400).json({
      error: 'content missing',
    });
  }

  const phone = new Phone({
    name: name,
    number: number,
  });

  phone
    .save()
    .then((savedPhone) => {
      response.json(savedPhone);
    })
    .catch((error) => next(error));
});

app.get('/info', (request, response) => {
  Phone.find({}).then((persons) => {
    response.send(
      `<h2>PhoneBook has info for ${persons.length} people<br/>
            ${new Date(Date.now())}
        </h1>`
    );
  });
});

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/phonebook', (request, response) => {
  Phone.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get('/api/phonebook/:id', (request, response, next) => {
  Phone.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put('/api/phonebook/:id', (request, response, next) => {
  const { name, number } = request.body;

  // new: true
  // It means use our custom document instead of default value.
  // see persons schema set method.
  // runValidators: true - turn on update validators
  Phone.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPhone) => {
      response.json(updatedPhone);
    })
    .catch((error) => next(error));
});

app.delete('/api/phonebook/:id', (request, response, next) => {
  Phone.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(200).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

// Last middleware. All routes must be registered before this.
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
