const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
  }
);

// @Todo: remove item. this was just a test.
const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'items',
  timestamps: false // We are not using createdAt/updatedAt columns
});

const Restaurant = sequelize.define('Restaurant', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  budget: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  tableName: 'restaurants',
  timestamps: false // We are not using createdAt/updatedAt columns
});

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tripDays: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  foodPreferences: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  destinationCity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  budget: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: false // We are not using createdAt/updatedAt columns
});

Restaurant.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});
User.hasMany(Restaurant, {
  foreignKey: 'userId',
  as: 'restaurants',
});

// Define the park model, which has these fields:
// {"objectid_1":1,"objectid":1,"park_cat":1,"tmk":"17036010","park_type":5,"park_name":"Kunawai Springs","main_dist":2,"link_id":60,"legal_acre":0.58999997,"globalid":"{28D54045-9FC1-407E-9DC2-BD7F78E5F489}","first_base":"F","first_soft":"F","first_foot":"F","first_socc":"F","first_rugb":"F","first_bask":"F","first_tenn":"F","first_voll":"F","first_teth":"F","first_golf":"F","first_comm":"F","first_hiki":"F","first_jogg":"F","first_exer":"F","first_skat":"F","first_sk_1":"F","first_outr":"F","first_picn":"F","first_camp":"F","first_ca_1":"F","first_chil":"F","first_swim":"F","first_gymn":"F","first_indo":"F","first_art_":"F","first_blea":"F","first_bus_":"F","first_co_1":"F","first_conc":"F","first_drin":"F","first_ex_1":"F","first_hand":"F","first_ha_1":"F","first_hist":"F","first_land":"T","first_life":"F","first_ligh":"F","first_park":"F","first_pay_":"F","first_pi_1":"F","first_rest":"F","first_shad":"F","first_show":"F","landwatcon":" ","staffed":" ","phone":null,"total_acre":0.59,"total_sqft":25700,"total_room":" ","maint_dist":2,"neighborho":14,"council":6,"first_city":"Honolulu","first_name":"650 Kunawai Lane","first_zip":"96817","first_pool":" ","first_po_1":" ","first_po_2":" ","x":1688852.3489026399,"y":57868.4069992346,"first_long":-157.8576929763,"first_lat":21.3259133761}

const Park = sequelize.define('Park', {
  objectid_1: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  objectid: {
    type: DataTypes.INTEGER,
  },
  park_cat: {
    type: DataTypes.INTEGER,
  },
  tmk: {
    type: DataTypes.STRING,
  },
  park_type: {
    type: DataTypes.INTEGER,
  },
  park_name: {
    type: DataTypes.STRING,
  },
  main_dist: {
    type: DataTypes.INTEGER,
  },
  link_id: {
    type: DataTypes.INTEGER,
  },
  legal_acre: {
    type: DataTypes.FLOAT,
  },
  globalid: {
    type: DataTypes.STRING,
  },
  first_base: {
    type: DataTypes.STRING,
  },
  first_soft: {
    type: DataTypes.STRING,
  },
  first_foot: {
    type: DataTypes.STRING,
  },
  first_socc: {
    type: DataTypes.STRING,
  },
  first_rugb: {
    type: DataTypes.STRING,
  },
  first_bask: {
    type: DataTypes.STRING,
  },
  first_tenn: {
    type: DataTypes.STRING,
  },
  first_voll: {
    type: DataTypes.STRING,
  },
  first_teth: {
    type: DataTypes.STRING,
  },
  first_golf: {
    type: DataTypes.STRING,
  },
  first_comm: {
    type: DataTypes.STRING,
  },
  first_hiki: {
    type: DataTypes.STRING,
  },
  first_jogg: {
    type: DataTypes.STRING,
  },
  first_exer: {
    type: DataTypes.STRING,
  },
  first_skat: {
    type: DataTypes.STRING,
  },
  first_sk_1: {
    type: DataTypes.STRING,
  },
  first_outr: {
    type: DataTypes.STRING,
  },
  first_picn: {
    type: DataTypes.STRING,
  },
  first_camp: {
    type: DataTypes.STRING,
  },
  first_ca_1: {
    type: DataTypes.STRING,
  },
  first_chil: {
    type: DataTypes.STRING,
  },
  first_swim: {
    type: DataTypes.STRING
},
  first_gymn: {
    type: DataTypes.STRING,
  },
  first_indo: {
    type: DataTypes.STRING,
  },
  first_art_: {
    type: DataTypes.STRING,
  },
  first_blea: {
    type: DataTypes.STRING,
  },
  first_bus_: {
    type: DataTypes.STRING,
  },
  first_co_1: {
    type: DataTypes.STRING,
  },
  first_conc: {
    type: DataTypes.STRING,
  },
  first_drin: {
    type: DataTypes.STRING,
  },
  first_ex_1: {
    type: DataTypes.STRING,
  },
  first_hand: {
    type: DataTypes.STRING,
  },
  first_ha_1: {
    type: DataTypes.STRING,
  },
  first_hist: {
    type: DataTypes.STRING,
  },
  first_land: {
    type: DataTypes.STRING,
  },
  first_life: {
    type: DataTypes.STRING,
  },
  first_ligh: {
    type: DataTypes.STRING,
  },
  first_park: {
    type: DataTypes.STRING,
  },
  first_pay_: {
    type: DataTypes.STRING,
  },
  first_pi_1: {
    type: DataTypes.STRING,
  },
  first_rest: {
    type: DataTypes.STRING,
  },
  first_shad: {
    type: DataTypes.STRING,
  },
  first_show: {
    type: DataTypes.STRING
},
  landwatcon: {
    type: DataTypes.STRING,
  },
  staffed: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  total_acre: {
    type: DataTypes.FLOAT,
  },
  total_sqft: {
    type: DataTypes.FLOAT,
  },
  total_room: {
    type: DataTypes.STRING,
  },
  maint_dist: {
    type: DataTypes.INTEGER,
  },
  neighborho: {
    type: DataTypes.INTEGER,
  },
  council: {
    type: DataTypes.INTEGER,
  },
  first_city: {
    type: DataTypes.STRING,
  },
  first_name: {
    type: DataTypes.STRING,
  },
  first_zip: {
    type: DataTypes.STRING,
  },
  first_pool: {
    type: DataTypes.STRING
  },
  first_po_1: {
    type: DataTypes.STRING
  },
  first_po_2: {
    type: DataTypes.STRING
  },
  x: {
    type: DataTypes.FLOAT
  },
  y: { 
    type: DataTypes.FLOAT
},
  first_long: { 
    type: DataTypes.FLOAT
},
  first_lat: { 
    type: DataTypes.FLOAT
}
}, {
  tableName: 'parks',
  timestamps: false
});

const AI = sequelize.define('AI', {
  // Define your AI model attributes here
  chatContext: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  parkIds: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
  },
}, {
  tableName: 'ai',
  timestamps: false // We are not using createdAt/updatedAt columns
});

module.exports = { sequelize, Item, User, Restaurant, Park, AI };