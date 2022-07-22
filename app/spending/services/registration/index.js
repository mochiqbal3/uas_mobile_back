'use strict';
const bcrypt = require('bcrypt');

const { authConfig } = require('../../configs');
const { uid } = require('../../helpers/uid');
const { User } = require('../../models/user');

/**
 * Function 
 */
const create = async (params) => {
  try {
    if (!(params.email && params.password)) {
      return {
        metadata: { http_code: 400 },
        error: { message: 'email_and_password_is_required' },
      };
    }

    let user = await User.findOne({ where: { email: params.email } });
    if (user) {
      return {
        metadata: { http_code: 409 },
        error: { message: 'email_already_registered' },
      };
    }
    const now = Date.now();
    const hashedPassword = await bcrypt.hash(params.password, authConfig.passwordSaltRound);

    user = await User.create({
      id: uid(),
      name: params.name,
      email: params.email,
      password: hashedPassword,
      created_date: now,
      updated_date: now,
    });

    return {
      metadata: { http_code: 201 },
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_date: user.created_date,
        updated_date: user.updated_date,
      }
    };
  } catch (error) {
    console.error('Error: Unable to execute registration.create  => ', error);

    return {
      metadata: { http_code: 500 },
      error: { message: 'unable_to_handle_request' },
    };
  }
};

module.exports = {
  create,
}