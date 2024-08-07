// BUILD YOUR SERVER HERE
const express = require('express');
const User = require('./users/model');

// user db methods: { find, findById, insert, update, remove }

const server = express();

server.use(express.json());

// GET USERS (List all)
server.get('/api/users', (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({
        message: 'The users information could not be retrieved',
      });
    });
});

// GET BY ID
server.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).json({
          message: 'The user with the specified ID does not exist',
        });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({
        message: 'The user information could not be retrieved',
      });
    });
});

// POST/CREATE
server.post('/api/users', (req, res) => {
  const aNewUser = req.body;
  if (!aNewUser.name || !aNewUser.bio) {
    res.status(400).json({
      message: 'Please provide name and bio for the user',
    });
  } else {
    User.insert(aNewUser)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        res.status(500).json({
          message: 'There was an error while saving the user to the database',
        });
      });
  }
});

// UPDATE
server.put('/api/users/:id', async (req, res) => {
  try {
    const possibleUser = await User.findById(req.params.id);
    if (!possibleUser) {
      res.status(404).json({
        message: 'The user with the specified ID does not exist',
      });
    } else {
      if (!req.body.name || !req.body.bio) {
        res.status(400).json({
          message: 'Please provide name and bio for the user',
        });
      } else {
        const updatedUser = await User.update(req.params.id, req.body);
        res.status(200).json(updatedUser);
      }
    }
  } catch (err) {
    res.status(500).json({
      message: 'The user information could not be modified',
    });
  }
});

// DELETE
server.delete('/api/users/:id', async (req, res) => {
  try {
    const possibleUser = await User.findById(req.params.id);
    if (!possibleUser) {
      res.status(404).json({
        message: 'The user with the specified ID does not exist',
      });
    } else {
      const deletedUser = await User.remove(possibleUser.id);
      res.status(200).json(deletedUser);
    }
  } catch (err) {
    res.status(500).json({
      message: 'The user could not be removed',
    });
  }
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
