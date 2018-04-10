module.exports = (sequelize, DataTypes) => {
  const company = sequelize.define('company', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: (models) => {
      },
    },
  });
  return company;
};
