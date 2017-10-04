# knex-tenanty

[![Build Status](https://travis-ci.org/brunolm/knex-tenanty.svg?branch=master)](https://travis-ci.org/brunolm/knex-tenanty)
[![npm version](http://img.shields.io/npm/v/knex-tenanty.svg?style=flat)](https://www.npmjs.com/package/knex-tenanty)

Knex middleware to handle multiple tenants.

You can run your application for several clients and the database will be created in different schemas.

## Example usage

```
KnexTenanty(
  /* knex config object */,
  /* function to extract client-id from request object */
);
```

### Sample project

https://github.com/brunolm/knex-mt

### Setting up the middleware

```ts
import * as express from 'express';

import { KnexTenanty } from 'knex-tenanty';
import knexSettings from '../knexfile';

const app = express.Router();

const settings = knexSettings[process.env.NODE_ENV];
const extractClientId = (req) => req.headers['x-client-id'];

const middleware = KnexTenanty(settings, extractClientId);
app.use(middleware);

export default app;
```

### Using knex to access the database

```ts
app.get('/', async (req, res) => {
  console.log('route /');
  const knex = req['knex'] as Knex.QueryBuilder;

  const values = await knex.from('test');
  res.send(values);
});

app.get('/insert', async (req, res) => {
  console.log('route /insert');
  const knex = req['knex'] as Knex.QueryBuilder;

  const values = await knex.insert({ name: req.query.name || 'bruno' }).into('test');
  res.send(values);
});
```
