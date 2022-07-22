'use strict';

const appResponse = require('./app-response');
const registration = require('../services/registration');

const create = async (req, res) => {
  appResponse.build(res, await registration.create(req.body));
};

module.exports = {
  create,
};
