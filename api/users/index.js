const controller = require('./users.controller');
const router = require('express').Router();
var response = require('../../lib/response');

router.get('/', async (req, res) => {
    try {
        const resp = await controller.readAll();
        return response.success(res, resp);
    } catch(err) {
        return response.error(res, err);
    }
});
router.get('/:id', async (req, res) => { 
    try {
        const resp = await controller.getUser(req.params.id);
        return response.success(res, resp);
    } catch(err) {
        return response.error(res, err);
    }
});
router.post('/',  async (req, res) => {
    try {
        const resp = await controller.create(req.body);
        return response.success(res, resp);
    } catch(err) {
        return response.error(res, err);
    }
});
router.put('/:id',  async (req, res) => {
    try {
        const resp = await controller.updateUser({id: req.params.id, body: req.body});
        return response.success(res, resp);
    } catch(err) {
        return response.error(res, err);
    }
});
router.delete('/:id', async (req, res) => { 
    try {
        const resp = await controller.removeUser(req.params.id);
        return response.success(res, resp);
    } catch(err) {
        return response.error(res, err);
    }
});

module.exports = router;