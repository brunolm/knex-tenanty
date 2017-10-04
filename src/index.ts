import * as Knex from 'knex';
import * as lru from 'lru-cache';

export interface Config extends Knex.Config {
  [key: string]: any;
}

const wrap = (fn) => (...args) => fn(...args).catch(args[2]);

export function KnexTenanty(settings: Config, extractClientId: (req: any) => string) {
  const cache = lru({});

  return wrap(async function middleware(req, res, next) {
    const cli = extractClientId(req);
    const schema = `c${cli}${settings.client === 'mysql' ? `_${(settings.connection as Knex.MySqlConnectionConfig).database}` : ''}`;

    const cachedKnex = cache.get(cli) as Knex;

    const mergedSettings = {
      ...settings,
      migrations: { ...settings.migrations },
      schema,
    };
    mergedSettings.migrations.tableName = `${schema}_${mergedSettings.migrations.tableName || 'knex_migrations'}`;

    const knex = cachedKnex || Knex(mergedSettings as any);

    if (!cachedKnex) {
      if (settings.migrations) {
        await knex.migrate.latest();
      }

      if (settings.seeds) {
        await knex.seed.run();
      }

      cache.set(cli, knex);
    }

    req.knex = knex.withSchema(schema);
    req.knexRaw = knex;

    next();
  });
}
