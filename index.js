const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
app.use(cors());
let persons = [
  { name: "saad", number: "0674504789", id: 0 },
  { name: "wani", number: "0674508578", id: 1 },
  { name: "mama", number: "07858508578", id: 2 },
];

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(express.json());
app.use(morgan(":method :url :status :body"));

app.get("/", (req, res) => {
  res.send("<h1>Hello World yo !</h1>");
});

app.get("/info", (req, res) => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  res.send(
    `<h2>Phonebook has info for ${persons.length} people</h2>  <h2> ${dateTime}</h2>`
  );
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "missing parameters",
    });
  } else if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "person info already registered",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
