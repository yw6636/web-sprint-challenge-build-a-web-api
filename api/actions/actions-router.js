// Write your "actions" router here!
const express = require ('express')
const Actions = require('./actions-model')
const { checkActionId, checkNewAction, checkValidProject } = require('./actions-middlware')
const router = express.Router();

router.get('/', async (req, res, next) => {
    const data = await Actions.get()
    try {
        res.status(200).json(data)
    }
    catch (err) {
        next(err)
    }
})

router.get('/:id', checkActionId, (req, res, next) => {
    res.json(req.action)
})

router.post('/', checkNewAction, async (req, res, next) => {
    const newPost = await Actions.insert(req.body)
    try {
        res.status(201).json(newPost)
    }
    catch (err) {
        next(err)
    }   
})

router.put('/:id', checkNewAction, checkActionId, async (req, res, next) => {
    const success = await Actions.update(req.params.id, req.body)
    try {
        res.status(200).json(success)
    }
    catch (err){
        next(err)
    }
})

router.delete('/:id', checkActionId, (req, res, next) => {
    Actions.remove(req.params.id)
        .then(() => {
            res.status(200).json()
        })
        .catch(err => next(err))
})

router.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        message: error.message,
        customMessage: "Error within the Actions router"
    })
})

module.exports = router