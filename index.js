// implement your API here
const express = require('express');

const db = require('./data/db.js');
const server = express();

// Add this to make PUT and POST work
server.use(express.json());

server.get('/', (req, res) => {
    res.send('Hello World!');
})

// POST /api/users
// Add a user
server.post('/api/users', (req, res) => {
    const userInfo = req.body;
    console.log('user information', userInfo);

    db.insert(userInfo).then(users => {
        if( !userInfo.name || !userInfo.bio ) {
            res.status(400).json({message: 'Please provide the name and bio for the user.'});
        } else {
            res.status(201).json(users);
        }
    })
    .catch(error => {
        res.status(500).json({message: 'There was an error while saving the user to the database'});
    })
})

// GET /api/users
// Get all users
server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        res.status(200).json(users);
    }).catch(error => {
        res.status(500).json({message: 'The users information could not be retrieved.'});
    })
})

// GET /api/users/:id
// Get a user by id
server.get('/api/users/:id', (req, res) => {
    const {id} = req.params;

    db.findById(id)
    .then(users => {
        if (!users) {
            res.status(500).json({message: 'The user with the specified ID does not exist.'});
        } else {
            res.status(200).json(users);
        }
        
        
    }).catch(error => {
        res.status(404).json({message: 'The user information could not be retrieved.'});
    })
});

// DELETE /api/users/:id
// Delete a user by id
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.remove(id).then(deleted => {
        if (!deleted) {
            res.status(500).json({message: 'The user with the specified ID does not exist.'});
        } else {
            res.status(204).end();
        }
    })
    .catch(error => {
        res.status(500).json({message: 'The user could not be removed'});
    })
});

// PUT /api/users/:id
// Update a user by id
server.put('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    db.update(id, changes).then(updated => {

        if (!id) {
            res.status(500).json({message: 'The user with the specified ID does not exist.'});
        } else if (!changes.name || !changes.bio ) {
            res.status(400).json({message: 'Please provide the name and bio for the user.'});
        } else if(updated) {
            res.status(200).json(changes);
        } else {
            res.status(404).json({message: 'user not found'});
        }
    })
    .catch(error => {
        res.status(500).json({message: 'The user information could not be modified.'});
    })
});

server.listen(5000, () => {
    console.log('\n** API up and running on port 5000 **');
});