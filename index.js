const fs = require("fs");
const Sequelize = require('sequelize');
const Promise = require('bluebird');
const express = require('express');
const graphqlHttp = require('express-graphql');
const graphqlTools = require('graphql-tools');

const config = require('./config');

const db = require('./models')(Sequelize, config);

const schema = fs.readFileSync('tmnt.graphql').toString();
const resolvers = require('./resolvers.js')(db);

const fillWithTestData = require('./models/test-data');

const app = express();

app.listen = Promise.promisify(app.listen).bind(app);

app.use('/', graphqlHttp({
    graphiql: true,
    schema: graphqlTools.makeExecutableSchema({
        typeDefs: schema,
        resolvers: resolvers
    }),
}));

(async function () {
  await fillWithTestData(db);

  await app.listen(config.port);

  console.log(`Server running at http://localhost:${config.port}`);
})();
