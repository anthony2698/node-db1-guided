const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

router.get('/', (req, res) => {
    db.select('*').from('posts')
        .then(posts => {
            res.status(200).json({
                data: posts
            })
        })
        .catch(err => {
            res.status(500).json({
                err: err.message
            });
        });
});

router.get('/:id', (req, res) => {
    db('posts').where({ id: req.params.id }).first()
        .then(post => {
            res.status(200).json({
                data: post
            });
        })
        .catch(err => {
            res.status(500).json({
                err: err.message
            });
        });
});

router.post('/', (req, res) => {
    db('posts').insert(req.body, "id")
        .then(ids => {
            const id = ids[0];

            db('posts').where({ id }).first()
                .then(post => {
                    res.status(201).json({
                        data: post
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                err: err.message
            });
        });
});

router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    db('posts').where({ id }).update(changes)
        .then(count => {
            count > 0
                ? res.status(200).json({
                    message: "update successful"
                })
                : res.status(404).json({
                    message: "No post with that ID."
                });
        })
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db('posts').where({ id }).del()
        .then(count => {
            count > 0
                ? res.status(200).json({
                    message: "delete successful"
                })
                : res.status(404).json({
                    message: "No post with that ID."
                });
        });
});

module.exports = router;