'use strict';
const bcrypt = require('bcrypt');

const { loginUser } = require('../auth');
const { User } = require('../../models/user');


/**
 * Function 
 */
 const login = async (params) => {
  try {
    if (!(params.email && params.password)) {
      return {
        metadata: { http_code: 400 },
        error: { message: 'email_and_password_is_required' },
      };
    }

    let user = await User.findOne({ where: { email: params.email } });
    if (!user) {
      return {
        metadata: { http_code: 404 },
        error: { message: 'user_not_found' },
      };
    }

    const match = await bcrypt.compare(params.password, user.password);
    if (!match) {
      return {
        metadata: { http_code: 400 },
        error: { message: 'invalid_password' },
      };
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = await loginUser(userData);

    return {
      metadata: { http_code: 200 },
      data: {
        access_token: token,
        user: userData
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

const logout = async () => {
  try {
    return {
      metadata: { http_code: 200 },
      data: { message: 'logout_success' },
    };
  } catch (error) {
    console.error('Error: Unable to execute session.logout => ', error);
    
    return {
      metadata: { http_code: 500 },
      error: { message: 'unable_to_handle_request' },
    };
  }
};

const getCurrentUser = async (currentUser) => {
  try {
    let user = await User.findOne({
      where: {
        id: currentUser.id
      }
    });
    
    if (!user) {
      return {
        metadata: { http_code: 404 },
        error: { message: 'user_not_found' },
      };
    }

    return {
      metadata: { http_code: 200 },
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_date: user.created_date,
        updated_date: user.created_date,
      }
    }
  } catch (error) {
    console.error('Error: Unable to execute session.getCurrentUser => ', error);

    return {
      metadata: { http_code: 500 },
      error: { message: 'unable_to_handle_request' },
    };
  }
};

module.exports = {
  login,
  logout,
  getCurrentUser,
};
