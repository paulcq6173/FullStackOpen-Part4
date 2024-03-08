import cors from "cors";
import express from "express";
import morgan from "morgan";
import errorHandler from "./errorHandler.js";
import Phone from "./models/persons.js";

const app = express();

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

// Middleware order
app.use(express.static("build")); // Serving static files from the backend
app.use(express.json());
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
);
app.use(cors());

//const FILE_PATH = "../data/db.json";
// Resloves ESLint: Parsing error: assert {type: "json"}
//const loadJSON = (path) =>
//  JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
//const writeJSON = (path, array) => JSON.stringify(writeFileSync(path, array));
//let phonebook = loadJSON(FILE_PATH);

/*function generateId() {
  const count = 5000;
  let nextId = Math.floor(Math.random() * count) + 1;
  const foundData = phonebook.find((e) => e.id === nextId);
  if (foundData) {
    nextId = Math.max(...phonebook.map((e) => e.id)) + 1;
  }

  return nextId;
}*/

app.post("/api/phonebook", (request, response) => {
  const body = request.body;
  const { name, number } = body;

  if (!name || !number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const phone = new Phone({
    name: name,
    number: number,
  });

  phone.save().then((savedPhone) => {
    response.json(savedPhone);
  });
});

app.get("/info", (request, response) => {
  Phone.find({}).then((persons) => {
    response.send(
      `<h2>PhoneBook has info for ${persons.length} people<br/>
            ${new Date(Date.now())}
        </h1>`
    );
  });
});

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/phonebook", (request, response) => {
  Phone.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/phonebook/:id", (request, response, next) => {
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

app.put("/api/phonebook/:id", (request, response) => {
  const body = request.body;

  const phone = {
    name: body.name,
    number: body.number,
  };

  // Option?:new
  // It means use our custom document instead of default value.
  // see persons schema set method
  Phone.findByIdAndUpdate(request.params.id, phone, { new: true })
    .then((updatedPhone) => {
      response.json(updatedPhone);
    })
    .catch((error) => next(error));
});

app.delete("/api/phonebook/:id", (request, response) => {
  Phone.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(200).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

// Last middleware. All routes must be registered before this.
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
