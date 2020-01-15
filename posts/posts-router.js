const router = require('express').Router();

const db = require('../data/db');

router.get('/', (req, res) => {
    db.find()
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(500).json({error: "The posts information could not be retrieved."}))
})

router.get('/:id', (req, res) => {
    const postId = req.params.id;

    db.findById(postId)
        .then(post => {
            if(!post){
                res.status(404).json({ message: "The post with the specified ID does not exist." })
                return null;
            }
            res.status(200).json(post);
        })
        .catch(err => res.status(500).json({ error: "The post information could not be retrieved." }))
})

router.get('/:id/comments', (req, res) => {
    db.findPostComments(req.params.id)
        .then(comments => {
            if(!comments.length){
                res.status(404).json({ message: "The post with the specified ID does not exist." })
                return null;
            }
            res.status(200).json(comments);
        })
        .catch(err => res.status(500).json({ error: "The comments information could not be retrieved." }))
    
})

router.post('/', (req, res) => {   
    if(!req.body.title || !req.body.contents) {
        res.status(400).json({errorMessage: 'Please provide title and contents for the post.'});
        return null
    }

    db.insert(req.body)
    .then(post => {
        res.status(200).json(post)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Error adding post'})
    })

})

router.post('/:id/comments', (req, res) => {
    if(!req.body.text) {
        res.status(400).json({errorMessage: 'Please provide text for the comment.'});
        return null
    }

    db.insertComment(req.body)
        .then(comment => {
            if(!comment){
                res.status(404).json({message: "The post with the specified ID does not exist."})
                return null;
            }
            res.status(201).json(comment);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({errorMessage: 'There was an error while saving the comment to the database.'})
        })
})

router.put('/:id', (req, res) => {
    console.log(req.params, req.body)
    if(!req.params.id || !req.body){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
        return null;
    }

    db.update(req.params.id, req.body)
        .then(post => {
            if(!post){
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
            res.status(200).json(post)
        })
        .catch(err => {
            res.status(500).json({ error: "The post information could not be modified." })
        })
    
})

router.delete('/:id', (req, res) => {
    const postId = req.params.id;
    db.remove(postId)
        .then(post => {
            if(!post){
                res.status(404).json({ message: "The post with the specified ID does not exist." })
                return null;
            }
            res.status(204).json(post)
        })
        .catch(err => res.status(500).json({ error: "The post could not be removed" }))
    
})

module.exports = router;