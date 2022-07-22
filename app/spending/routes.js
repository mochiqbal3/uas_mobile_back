const express = require('express');

const authSrv = require('./services/auth');
const registration = require('./controllers/registration');
const session = require('./controllers/session');
const spending = require('./controllers/spending');

const router = express.Router();

// registration
router.post('/registrations', registration.create);

// session
router.post('/sessions/login', session.login);
router.delete('/sessions/logout', authSrv.authenticateUser, session.logout);
router.get('/sessions/current-user', authSrv.authenticateUser, session.getCurrentUser);

// spending
router.get('/spendingByUser', spending.all);
router.post('/create', spending.create);
router.get('/get/:id', spending.show);
router.put('/update/:id', spending.update);
router.delete('/delete/:id', spending.destroy);

module.exports = router;
