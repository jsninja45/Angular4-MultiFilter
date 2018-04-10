const db = require('../models');
const Company = require('../models').company;
const _ = require('lodash');

module.exports = {
  create(req, res) {
    return Company
      .create({
        name: req.body.name,
        number: req.body.number,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        total_amount: req.body.total_amount
      })
      .then(company => res.status(201).send(company))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return Company
      .all()
      .then(companies => res.status(200).send(companies))
      .catch(error => res.status(400).send(error));
  },
  filter(req, res) {
    let params = req.body;
    let raw_query = '';
    let query = {}

    if(params.operator3 && params.data.length > 1) {
      let operator3 = params.operator3.toLowerCase();
      if(operator3 == 'and'){
        query = {
          $and: []
        }
        _.each(params.data, function(data) {
          if(data.operator2 == 'and'){
            query.$and.push({
              $and: buildQuery(data.items)
            });
          }else if (data.operator2 == 'or') {
            query.$and.push({
              $or: buildQuery(data.items)
            });
          }
        })
      }else if (operator3 == 'or'){
        query = {
          $or: []
        }
        _.each(params.data, function(data) {
          if(data.operator2 == 'and'){
            query.$or.push({
              $and: buildQuery(data.items)
            });
          }else if (data.operator2 == 'or') {
            query.$or.push({
              $or: buildQuery(data.items)
            });
          }
        })
      }
    }else {
      if(params.data[0].operator2 == 'and'){
        query = {
          $and: buildQuery(params.data[0].items)
        }
      }else if(params.data[0].operator2 == 'or') {
        query = {
          $or: buildQuery(params.data[0].items)
        }
      }
    }

    Company.findAll({
      where: query,
      logging: function(query) {
        raw_query = query;
      }
    })
    .then(function(companies){
      res.status(200).send({companies: companies, query_string: raw_query});
    })
    .catch(error => {
      console.log(error);
      res.status(400).send(error)
    });
  }
};

function buildQuery(params) {
  let queries = [];

  _.each(params, function(param) {
    if(param.field == 'Total Amount')
      param.field = 'total_amount';

    param.field = param.field.toLowerCase();

    if (param.operator == '=' || param.operator == 'Is equal to') {
      queries.push({
        [param.field]: {$eq: param.val}
      })
    }else if(param.operator == '!=' || param.operator == 'Is not equal to'){
      queries.push({
        [param.field]: {$ne: param.val}
      })
    }else if (param.operator == 'Contains') {
      queries.push({
        [param.field]: {$iLike: '%' + param.val +'%'}
      })
    }else if (param.operator == 'Does not contain') {
      queries.push({
        [param.field]: {$notILike: '%' + param.val +'%'}
      })
    }else if (param.operator == '>=') {
      queries.push({
        [param.field]: {$gte: param.val}
      })
    }else if (param.operator == '>') {
      queries.push({
        [param.field]: {$gt: param.val}
      })
    }else if (param.operator == '<=') {
      queries.push({
        [param.field]: {$lte: param.val}
      })
    }else if (param.operator == '<') {
      queries.push({
        [param.field]: {$lt: param.val}
      })
    }
  })

  return queries;
}
