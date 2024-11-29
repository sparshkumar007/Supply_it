const express = require('express');
const router = express.Router();

router.post('/uploadonipfs', require('../controllers/web3Controller').uploadonipfs);

router.get('/downloadonipfs', require('../controllers/web3Controller').downloadonipfs);

module.exports = router;