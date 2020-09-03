const express = require("express");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

// middlewares
app.use(express.json());
app.use(morgan(":method :url :status :body"));
app.use(cors());
app.use(express.static("build"));

// start of the API

// get all resources
app.get("/api/persons", (req, res) => {
  Person.find({}).then((result) => {
    res.json(result);
  });
});

// get one resource
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(500).end();
    });
});

// create a resource
app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson.toJSON());
    })
    .catch((error) => next(error));
});

// delete a resource
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// updating a resource
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedperson) => {
      response.json(updatedperson);
    })
    .catch((error) => next(error));
});

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

// handler of requests with result to errors
app.use(errorHandler);

//  binding the port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
