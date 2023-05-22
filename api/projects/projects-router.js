// Write your "projects" router here!
const express = require('express')
const Projects = require('./projects-model')
const { checkId, checkNewProject } = require('./projects-middleware')
const router = express.Router();

router.get('/', async (req, res, next) => {
    const data = await Projects.get()
    try {
        res.status(200).json(data)
    }
    catch (err) {
        next(err)
    }
})

router.get('/:id', checkId, (req, res, next) => {
    res.json(req.project)
})

router.post('/', checkNewProject, async (req, res, next) => {
    const newPost = await Projects.insert(req.body)
    try {
        res.status(201).json(newPost)
    }
    catch (err) {
        next(err)
    }
})

router.put('/:id', checkId, checkNewProject, async (req, res, next) => {
    const success = await Projects.update(req.params.id, req.body)
    try {
        res.status(200).json(success)
    }
    catch (err) {
        next(err)
    }
})

router.delete('/:id', checkId, async (req, res, next) => {
    Projects.remove(req.params.id)
        .then(() => {
            res.status(200).json()
        })
        .catch(err => next(err))
})

router.get('/:id/actions', checkId, async(req, res, next) => {
    const actions = await Projects.getProjectActions(req.params.id)
    try {
        res.status(200).json(actions)
    }
    catch (err) {
        next(err)
    }
})

router.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        message: error.message,
        customMessage: "error within the projects router"
    })
})
module.exports = router