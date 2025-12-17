require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
let Person = require("./models/person");

const app = express();
morgan.token("body", (request) => JSON.stringify(request.body));

app.use(express.static("dist"));
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((persons) => response.json(persons))
    .catch((error) => response.status(500).json({ error }));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person).status(200);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  Person.findOne({ name })
    .then((person) => {
      if (person) {
        return response.status(400).json({
          error: "Name must be unique",
        });
      }

      const newPerson = {
        name,
        number,
      };

      Person.create(newPerson)
        .then((person) => response.json(person))
        .catch((error) => response.status(500).json({ error }));
    })
    .catch((error) => response.status(500).json({ error }));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const newData = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate({ _id: request.params.id }, newData, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((person) => response.json(person))
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.deleteOne({ _id: request.params.id })
    .then(() => response.status(204).end())
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  const date = new Date();
  Person.find({})
    .countDocuments()
    .then((persons) =>
      response.send(
        `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
      )
    )
    .catch((error) => response.status(500).json({ error }));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(errorHandler);
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
