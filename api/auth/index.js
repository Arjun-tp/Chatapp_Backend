const router = require('express').Router();
const authService = require('./auth.service');

router.post('/login', async (req, res) => {
    try {
        const resp = await authService.login(req.body);
        return res.json({success: true, data: resp});
    } catch(err) {
        return res.status(403).json({success: false, data: err.message});
    }
});

router.post('/register', async (req, res) => {
    try {
        const resp = await authService.register(req.body);
        return res.json({success: true, data: resp});
    } catch(err) {
        console.log("error in route: ", err);
        return res.status(403).json({success: false, data: err.message});
    }
});

module.exports = router;