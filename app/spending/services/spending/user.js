'use strict';

const { uid } = require('../../helpers/uid');
const { Spending } = require('../../models/spending');

const all = async (params) => {
  try {
    const page = params.page ? parseInt(params.page) : 1;
    const limit = params.limit ? parseInt(params.limit) : 100;
    const offset = (page * limit) - limit;

    const spending = await Spending.findAll({
      where: {
        user_id : params.user_id
      },
      limit: limit,
      offset: offset,
      order: [
        [params.order_by || 'updated_date', params.order_dir || 'DESC']
      ],
    });

    return {
      metadata: { http_code: 200, page, limit },
      data: spending
    };
  } catch (error) {
    console.error('Error: Unable to execute all spending.admin => ', error);
    
    return {
      metadata: { http_code: 500 },
      error: { message: 'unable_to_handle_request' },
    };
  }
};

const create = async (params) => {
  try {
    const now = Date.now();
    let spending = await Spending.create({
      id: uid(),      
      created_date: now,
      updated_date: now,

      name: params.name,
      description: params.description,
      nominal: params.nominal,
      user_id: params.user_id,
    });

    return {
      metadata: { http_code: 201 },
      data: spending,
    };
  } catch (error) {
    console.error('Error: Unable to execute create spending.admin ', error);
    
    return {
      metadata: { http_code: 500 },
      error: { message: 'unable_to_handle_request' },
    };
  }
};

const show = async (id) => {
  try {
    const spending = await Spending.findOne({
      where: {
        id,
      }
    });

    if (!spending) {
      return {
        metadata: { http_code: 404 },
        error: { message: 'record_not_found' },
      };
    }

    return {
      metadata: { http_code: 200 },
      data: spending
    };
  } catch (error) {
    console.error('Error: Unable to execute show spending.admin ', error);
    
    return {
      metadata: { http_code: 500 },
      error: { message: 'unable_to_handle_request' },
    };
  }
};

const update = async (id, params) => {
  try {
    // data validation
    let spending = await Spending.findOne({
      where: {
        id,
      }
    });

    if (!spending) {
      return {
        metadata: { http_code: 404 },
        error: { message: 'record_not_found' },
      };
    }
    // data validation

    // data preparation
    const data = {
      updated_date: Date.now()
    };

    if (params['name']) {
      data['name'] = params['name'];
    }

    if (params['description']) {
      data['description'] = params['description'];
    }

    if (params['nominal']) {
      data['nominal'] = params['nominal'];
    }

    // data preparation end

    spending = await spending.update(data);

    return {
      metadata: { http_code: 200 },
      data: spending
    };
  } catch (error) {
    console.error('Error: Unable to execute update spending.admin ', error);
    
    return {
      metadata: { http_code: 500 },
      error: { message: 'unable_to_handle_request' },
    };
  }
};

const destroy = async (id) => {
  try {
    // data validation
    const spending = await Spending.findOne({
      where: {
        id,
      }
    });

    if (!spending) {
      return {
        metadata: { http_code: 404 },
        error: { message: 'record_not_found' },
      };
    }
    // data validation

    await Spending.destroy({
      where: { id }
    });

    return {
      metadata: { http_code: 200 },
      data: {
        message: 'record_has_been_deleted',
        spending
      }
    };
  } catch (error) {
    console.error('Error: Unable to execute destroy spending.admin ', error);
    
    return {
      metadata: { http_code: 500 },
      error: { message: 'unable_to_handle_request' },
    };
  }
};

module.exports = {
  all,
  create,
  show,
  update,
  destroy
};