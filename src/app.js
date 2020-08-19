const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body

  const newRepo = {id:uuid(), url, title, techs, likes:0}
  repositories.push(newRepo)

  return response.status(201).json(newRepo)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {title, url, techs} = request.body

  const repositoryIndex = repositories.findIndex(repo=>repo.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found' });
  }

  const likes = repositories[repositoryIndex].likes;

  const updateRepo = {id, title, url, techs, likes};

  repositories[repositoryIndex] = updateRepo;

  return response.status(202).json(updateRepo)

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo=>repo.id === id);

  if(repositoryIndex<0){
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex,1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo=>repo.id === id);

  if(repositoryIndex<0){
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories[repositoryIndex].likes += 1

  return response.json(repositories[repositoryIndex])
});

module.exports = app;
