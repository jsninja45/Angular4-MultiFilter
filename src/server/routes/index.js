const companyController = require('../controllers').company;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the API!',
  }));

  app.post('/api/company', companyController.create);
  app.get('/api/company', companyController.list);
  app.post('/api/company/filter', companyController.filter);
};
