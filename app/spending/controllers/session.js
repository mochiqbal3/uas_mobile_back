'use strict';

const appResponse = require('./app-response');
const session = require('../services/session');

const login = async (req, res) => {
  appResponse.build(res, await session.login(req.body));
};

const logout = async (req, res) => {
  appResponse.build(res, await session.logout(req.body));
};

const getCurrentUser = async (req, res) => {
  appResponse.build(res, await session.getCurrentUser(req.currentUser));
};

module.exports = {
  login,
  logout,
  getCurrentUser
};
