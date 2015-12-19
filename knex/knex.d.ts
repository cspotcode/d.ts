// Type definitions for knex 0.9.0
// Project: http://knexjs.org/
// Definitions by: Andrew Bradley <https://github.com/cspotcode>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/*
 * Suggested usage:
 *
 *     import * as Knex from 'knex';
 *     import {knex} from 'knex';
 *     const knex = Knex({...options...});

 * Notice that `knex` is used twice: once as an import and again as a variable.
 * This is intentional.
 *
 * The `import` will import only type information.  This enables things like
 * `var foo: knex.Foo;` where type information is required.  The imported namespace,
 * `Knex.knex` does not exist at runtime; it is purely type information.
 *
 * The `const` stores a reference to your knex instance.  This enables things like
 * `knex.doStuff()` and `class Foo extends knex.SomeClass` where `knex.SomeClass`
 * must be an expression referencing an actual constructor function.
 */

/// <reference path="../bluebird/bluebird.d.ts" />
/// <reference path="../node/node.d.ts" />

declare module "knex" {

    import Promise = require('bluebird');
    import Bluebird = require('bluebird');

    type TODO = any;

    type Dictionary<T> = {[key: string]: T};

    // A function that accepts any arguments and returns T
    type Returns<T> = (...args: Array<any>) => T;

    function Knex(options: Knex.knex.KnexOptions): knex<Knex.knex.AbstractClient>;

    // Alias to avoid shadowing...
    import knexInstance = knex;
    
    namespace Knex {
        
        // ...and import the alias locally.
        import _k = knexInstance;

        // https://github.com/tgriesser/knex/blob/master/src/index.js#L29
        var Client: TODO;
        // https://github.com/tgriesser/knex/blob/master/src/index.js#L44
        var Promise: typeof Bluebird;
        // https://github.com/tgriesser/knex/blob/master/src/index.js#L33
        var raw: TODO;

        namespace knex {
            // Re-export all interfaces from knex (instance) here.

            type KnexInstance<C extends AbstractClient> = _k<C>;

            type SqlValue<C extends AbstractClient> = string|KnexRaw<C>|QueryBuilder<C, any>;
            type SqlIdentifier<C extends AbstractClient> = string|KnexRaw<C>;

            interface KnexOptions {
                client: string;
                connection: string|{};
                debug?: boolean;
                pool?: {
                    min?: number;
                    max?: number;
                    beforeCreate?(connection: any, cb: (err: any) => void): void;
                };
                migrations?: {
                    tableName?: string;
                }
            }

            interface AbstractClient {
                /** Brand for nominal typing; do not use. */
                _knexClientBrand: any;
            }

            /* Type system has no way of knowing what this query will return */
            interface KnexRaw<C extends AbstractClient> extends CommonBuilderInterface<any> {
                wrap(before: string, after: string): this;
            }

            /**
             * Anything from QueryBuilder interface that is also on `KnexInstance`
             */
            interface QueryBuilderAlsoOnRoot<C extends AbstractClient, R> extends NodeJS.EventEmitter {

                // Methods in this interface can't return `this` because `KnexInstance` implements this interface.
                // When these methods are called on `KnexInstance`, they still must return a full `QueryBuilder`.

                as(name: string): QueryBuilder<C, R>;

                columns: TODO;
                select(...columns: Array<string>): QueryBuilder<C, R>;
                column(...columns: Array<string>): QueryBuilder<C, R>;
                column(columns: Array<string>): QueryBuilder<C, R>;

                table(table: string): QueryBuilder<C, R>;
                from(table: string): QueryBuilder<C, R>;
                into(table: string): QueryBuilder<C, R>;

                where(criteria: {[column: string]: any}): QueryBuilder<C, R>;
                where(column: string, value: string): QueryBuilder<C, R>;
                where(column: string, operator: string, value: string): QueryBuilder<C, R>;

                withSchema: Returns<QueryBuilder<C, R>>;

                distinct: Returns<QueryBuilder<C, R>>;
                join: Returns<QueryBuilder<C, R>>;
                innerJoin: Returns<QueryBuilder<C, R>>;
                leftJoin: Returns<QueryBuilder<C, R>>;
                leftOuterJoin: Returns<QueryBuilder<C, R>>;
                rightJoin: Returns<QueryBuilder<C, R>>;
                rightOuterJoin: Returns<QueryBuilder<C, R>>;
                outerJoin: Returns<QueryBuilder<C, R>>;
                fullOuterJoin: Returns<QueryBuilder<C, R>>;
                crossJoin: Returns<QueryBuilder<C, R>>;
                joinRaw: Returns<QueryBuilder<C, R>>;
                andWhere: Returns<QueryBuilder<C, R>>; // DITTO
                orWhere: Returns<QueryBuilder<C, R>>;
                whereNot: Returns<QueryBuilder<C, R>>;
                orWhereNot: Returns<QueryBuilder<C, R>>;
                whereRaw: Returns<QueryBuilder<C, R>>;
                orWhereRaw: Returns<QueryBuilder<C, R>>;
                whereWrapped: Returns<QueryBuilder<C, R>>;
                havingWrapped: Returns<QueryBuilder<C, R>>;
                whereExists: Returns<QueryBuilder<C, R>>;
                orWhereExists: Returns<QueryBuilder<C, R>>;
                whereNotExists: Returns<QueryBuilder<C, R>>;
                orWhereNotExists: Returns<QueryBuilder<C, R>>;
                whereIn: Returns<QueryBuilder<C, R>>;
                orWhereIn: Returns<QueryBuilder<C, R>>;
                whereNotIn: Returns<QueryBuilder<C, R>>;
                orWhereNotIn: Returns<QueryBuilder<C, R>>;
                whereNull: Returns<QueryBuilder<C, R>>;
                orWhereNull: Returns<QueryBuilder<C, R>>;
                whereNotNull: Returns<QueryBuilder<C, R>>;
                orWhereNotNull: Returns<QueryBuilder<C, R>>;
                whereBetween: Returns<QueryBuilder<C, R>>;
                whereNotBetween: Returns<QueryBuilder<C, R>>;
                orWhereBetween: Returns<QueryBuilder<C, R>>;
                orWhereNotBetween: Returns<QueryBuilder<C, R>>;
                groupBy: Returns<QueryBuilder<C, R>>;
                groupByRaw: Returns<QueryBuilder<C, R>>;
                orderBy: Returns<QueryBuilder<C, R>>;
                orderByRaw: Returns<QueryBuilder<C, R>>;
                union: Returns<QueryBuilder<C, R>>;
                unionAll: Returns<QueryBuilder<C, R>>;
                having: Returns<QueryBuilder<C, R>>;
                orHaving: Returns<QueryBuilder<C, R>>;
                havingRaw: Returns<QueryBuilder<C, R>>;
                orHavingRaw: Returns<QueryBuilder<C, R>>;
                offset: Returns<QueryBuilder<C, R>>;
                limit: Returns<QueryBuilder<C, R>>;
                count: Returns<QueryBuilder<C, R>>;
                min: Returns<QueryBuilder<C, R>>;
                max: Returns<QueryBuilder<C, R>>;
                sum: Returns<QueryBuilder<C, R>>;
                avg: Returns<QueryBuilder<C, R>>;
                countDistinct: Returns<QueryBuilder<C, R>>;
                sumDistinct: Returns<QueryBuilder<C, R>>;
                avgDistinct: Returns<QueryBuilder<C, R>>;
                increment: Returns<QueryBuilder<C, R>>;
                decrement: Returns<QueryBuilder<C, R>>;
                first: Returns<QueryBuilder<C, R>>;
                pluck: Returns<QueryBuilder<C, R>>;
                insert: Returns<QueryBuilder<C, R>>;
                update: Returns<QueryBuilder<C, R>>;
                returning: Returns<QueryBuilder<C, R>>;
                delete: Returns<QueryBuilder<C, R>>;
                del: Returns<QueryBuilder<C, R>>; // DITTO
                truncate: Returns<QueryBuilder<C, R>>;
                fromJS: Returns<QueryBuilder<C, R>>;
            }

            /*
             * C is the type of Client (Mysql, Postgres, SQLite, etc)
             * R is the return type when the query is actually executed (Promise<R>)
             */
            interface QueryBuilder<C extends AbstractClient, R> extends QueryBuilderAlsoOnRoot<C, R>, CommonBuilderInterface<TODO> {

                // Note that this only contains methods that aren't also shared on KnexInstance

                toSQL(): SqlQuery; // TODO does this take options?
                toString(): string; // TODO does this take options?
                clone(): this;

                andWhereNot: Returns<this>; // DITTO
                andWhereRaw: Returns<this>; // DITTO
                andHaving: Returns<this>; // DITTO
                columnInfo: Returns<this>;
                forUpdate: Returns<this>;
                forShare: Returns<this>;
                modify: Returns<this>;

                or: this;
                not: this;
            }

            /*
             * Anything from CommonBuilderInterface that's also on KnexInstance
             */
            interface CommonBuilderInterfaceAlsoOnRoot<R> {
                connection: TODO;
                debug: TODO;
                transacting: TODO;
            }

            /**
             * Common interface to execute a knex query.  Knex exposes methods to execute queries using Promise syntax,
             * Node-style callbacks, or Node streams.
             *
             * These are all in https://github.com/tgriesser/knex/blob/master/src/interface.js
             *
             * TODO rename; not all methods are related to "executing" a query
             */
            interface CommonBuilderInterface<R> extends PromiseInterface<R>, CommonBuilderInterfaceAlsoOnRoot<R> {

                // Note that this only contains methods that aren't also shared on KnexInstance

                toQuery: TODO; // TODO this isn't documented; remove it?

                options: TODO;

                // http://knexjs.org/#Interfaces-Streams
                stream: TODO;
                pipe: TODO;
            }

            /*
             * R is the return type of the promise (Promise<R>)
             */
            interface PromiseInterface<R> {
                // http://knexjs.org/#Interfaces-Promises
                // https://github.com/tgriesser/knex/blob/master/src/interface.js#L75
                bind: TODO;
                catch: TODO;
                finally: TODO;
                spread: TODO;
                map: TODO;
                reduce: TODO;
                tap: TODO;
                thenReturn: TODO;
                return: TODO;
                yield: TODO;
                ensure: TODO;
                /** @deprecated */
                nodeify: TODO;
                /** @deprecated */
                exec: TODO;
                then: TODO;

                // http://knexjs.org/#Interfaces-Callbacks
                asCallback: TODO;
            }

            interface Knexfile {
                [environment: string]: KnexfileEnvironment;
            }

            interface KnexfileEnvironment extends KnexOptions {
                seeds?: {
                    directory?: string;
                }
            }

            /**
             * The promise-like object returned from a call to `knex.transaction()`
             */
            interface Transaction extends NodeJS.EventEmitter, PromiseInterface<TODO> {
                isCompleted: TODO;
                being: TODO;
                savepoint: TODO;
                commit: TODO;
                release: TODO;
                rollback: TODO;
                rollbackTo: TODO;
                query: TODO;
                debug: TODO;
                acquireConnection: TODO;
            }

            /**
             * Passed to the callback in a `knex.transaction()` call
             * It's a full-featured Knex object with a few extra, transaction-specific methods.
             */
            interface Transactor<C extends AbstractClient> extends KnexInstance<C> {
                transaction: TODO;
                savepoint: TODO;
                commit: TODO;
                rollback: TODO;
            }

            /**
             * Returned by toSQL()
             * Describes a SQL query, with bindings.
             */
            interface SqlQuery {
                method: string;
                bindings: Array<any>;
                options: TODO;
                sql: string;
            }
        }
    }
    export = Knex;

    import _k = Knex.knex;

    interface knex<C extends _k.AbstractClient> extends _k.QueryBuilderAlsoOnRoot<C, Array<Dictionary<any>>>, _k.CommonBuilderInterfaceAlsoOnRoot<TODO> {

        (tableName: string): _k.QueryBuilder<C, Array<Dictionary<any>>>; // TODO

        destroy(): Promise<any>;
        destroy(cb: () => void): void;

        raw(rawSql: string, bindings?: Array<any>): _k.KnexRaw<C>;

        transaction(callback: (trx: _k.Transactor<C>) => any): _k.Transaction;

        queryBuilder(): _k.QueryBuilder<C, Array<Dictionary<any>>>;

    }

    namespace knex {
        // Put all declarations for runtime variables here.
        // For example, classes.

        import _k = Knex.knex;
    }

}
