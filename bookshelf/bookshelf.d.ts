// Type definitions for bookshelf 0.9.1
// Project: http://bookshelfjs.org/
// Definitions by: Andrew Bradley <https://github.com/cspotcode>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/*
 * Suggested usage:
 *
 *     import * as Bookshelf from 'bookshelf';
 *     import {bookshelf} from 'bookshelf';
 *     const bookshelf = Bookshelf({...options...});

 * Notice that `bookshelf` is used twice: once as an import and again as a variable.
 * This is intentional.
 *
 * The `import` will import only type information.  This enables things like
 * `var foo: bookshelf.Foo;` where type information is required.  The imported namespace,
 * `Bookshelf.bookshelf` does not exist at runtime; it is purely type information.
 *
 * The `const` stores a reference to your bookshelf instance.  This enables things like
 * `bookshelf.doStuff()` and `class Foo extends bookshelf.SomeClass` where `bookshelf.SomeClass`
 * must be an expression referencing an actual constructor function.
 */

/// <reference path="../bluebird/bluebird.d.ts" />
/// <reference path="../knex/knex.d.ts" />

/*
 * TODO change all `options` arguments to type any or Dictionary<any>
 *   or combine them all into a single options Interface.  I'm worried that the interface will be missing important
 *   options and cause type errors that are more annoying than helpful.
 *
 * TODO I assume that model IDs must be either a string or a number.  Is this always true?
 *
 * TODO add Events mixin to top-level Bookshelf instance (that which is returned by require('bookshelf')()
 *
 * TODO add all errors to top-level Bookshelf instance
 *   (they get mixed in here:https://github.com/tgriesser/bookshelf/blob/master/src/bookshelf.js#L179)
 *
 * TODO re-export all interfaces from Bookshelf.bookshelf on Bookshelf
 *   consumers should have the option of doing `import bookshelf = Bookshelf.bookshelf` or not.
 */

declare module "bookshelf" {

    /***********/
    /* IMPORTS */
    /***********/

    import Promise = require('bluebird');
    import Knex = require('knex');

    /*****************************/
    /* MISC HELPERS AND TYPEDEFS */
    /*****************************/

    interface Dictionary<T> {
        [key: string]: T;
    }

    interface Ctor<T> {
        new (...args: Array<any>): T;
    }

    var ErrorConstructor: typeof Error;

    // Anywhere something is type TODO, I should add proper type information in the future.
    type TODO = any;

    type Transaction = TODO;
    import QueryBuilder = Knex.knex.QueryBuilder;
    import AbstractClient = Knex.knex.AbstractClient;

    import KnexInstance = Knex.knex.KnexInstance;

    /** A model's primary key */
    type Id = string|number;

    /*******************/
    /* BOOKSHELF STUFF */
    /*******************/

    /**
     * Construct a bookshelf instance.
     * @param knex Knex instance to use.
     */
    function Bookshelf(knex: KnexInstance<AbstractClient>): typeof bookshelf;

    // Alias to avoid shadowing...
    import bookshelfInstance = bookshelf;

    namespace Bookshelf {

        // ...and import the alias locally.
        import _b = bookshelfInstance;

        /**
         * All bookshelf interfaces and types.
         */
        export namespace bookshelf {

            /*
             * Re-export all interfaces here.  Do *not* declare any classes or vars.  This namespace should exist
             * only in type-land.
             */

            type Model = _b.Model;
            type ModelConstructor = typeof _b.Model;

            namespace Model {
                type NotFoundError = _b.Model.NotFoundError;
                type NoRowsDeletedError = _b.Model.NoRowsDeletedError;
                type NoRowsUpdatedError = _b.Model.NoRowsUpdatedError;
            }

            type Collection<M extends Model> = _b.Collection<M>;
            type CollectionConstructor = typeof _b.Collection;

            namespace Collection {
                type EmptyError = _b.Collection.EmptyError;
            }

            // Errors are also exported on bookshelf directly
            type NotFoundError = _b.Model.NotFoundError;
            type NoRowsDeletedError = _b.Model.NoRowsDeletedError;
            type NoRowsUpdatedError = _b.Model.NoRowsUpdatedError;
            type EmptyError = _b.Collection.EmptyError;

            /**
             * Mixed onto model instances returned by the various relation methods such as `belongsTo` and `hasOne`.
             */
            interface RelatedModel<M extends Model> {
                /**
                 * Helps to create dynamic relations between `models` and `collections`, where a `hasOne`, `hasMany`,
                 * `belongsTo`, or `belongsToMany` relation may run through a `JoinModel`.
                 *
                 * A good example of where this would be useful is if a book `hasMany` paragraphs through chapters.
                 *
                 * The "through" table creates a pivot model, which it assigns to `model.pivot` after it is created. On
                 * `toJSON`, the pivot model is flattened to values prefixed with `_pivot_`.
                 *
                 * @param Interim Pivot model.
                 * @param throughForeignKey Foreign key in this model. By default, the `foreignKey` is assumed to be the
                 * singular form of the `Target` model's tableName, followed by `_id` / `_{{idAttribute}}`.
                 * @param otherKey Foreign key in the `Interim` model. By default, the `otherKey` is assumed to be the
                 * singular form of this model's tableName, followed by `_id` / `_{{idAttribute}}`.
                 */
                through(Interim: Ctor<Model>, throughForeignKey?: string, otherKey?: string): M&RelatedModel<M>;

            }

            interface RelatedCollection<M extends Model> extends Collection<M> {
                /*
                 * From the docs:
                 * Collections returned by a belongsToMany relation are decorated with several pivot helper methods. See
                 * attach, detach, updatePivot and withPivot for more information.
                 */

                attach(ids: Id|M|Array<Id|M>, options?: CollectionAttachOptions): Promise<this>;

                detach(ids?: Id|M|Array<Id|M>, options?: CollectionDetachOptions): Promise<void>;

                updatePivot(attributes: Dictionary<any>, options?: CollectionUpdatePivotOptions): Promise<number>;

                withPivot(columns: Array<string>): this;

                /**
                 * Helps to create dynamic relations between `models` and `collections`, where a `hasOne`, `hasMany`,
                 * `belongsTo`, or `belongsToMany` relation may run through a `JoinModel`.
                 *
                 * A good example of where this would be useful is if a book `hasMany` paragraphs through chapters.
                 *
                 * The "through" table creates a pivot model, which it assigns to `model.pivot` after it is created. On
                 * `toJSON`, the pivot model is flattened to values prefixed with `_pivot_`.
                 *
                 * @param Interim Pivot model.
                 * @param throughForeignKey Foreign key in this model. By default, the `foreignKey` is assumed to be the
                 * singular form of the `Target` model's tableName, followed by `_id` / `_{{idAttribute}}`.
                 * @param otherKey Foreign key in the `Interim` model. By default, the `otherKey` is assumed to be the
                 * singular form of this model's tableName, followed by `_id` / `_{{idAttribute}}`.
                 */
                through(Interim: Ctor<Model>, throughForeignKey?: string, otherKey?: string): this;
            }

            // TODO dedupe properties shared among multiple Options interfaces

            interface ModelOptions {
                /**
                 * Initial value for `tableName`
                 */
                tableName?: string;
                /**
                 * Initial value for `hasTimestamps`
                 * Defaults to false
                 */
                hasTimestamps?: boolean;
                /**
                 * Convert attributes by `parse` before being `set` on the model.
                 * Defaults to false
                 */
                parse?: boolean;
            }

            type ModelFetchOptions = TODO;
            type ModelFetchAllOptions = TODO;

            interface ModelSaveOptions {
                /**
                 * Optionally run the query in a transaction.
                 */
                transacting?: Transaction;
                /**
                 * Explicitly select a save method, either `"update"` or `"insert"`.
                 */
                method?: string;
                /**
                 * Assign `defaults` in an `update` operation.  Defaults to `false`.
                 */
                defaults?: boolean;
                /**
                 * Only save attributes supplied in arguments to `save`.  Defaults to `false`.
                 */
                patch?: boolean;
                /**
                 * Throw a `Model.NoRowsUpdatedError` if no records are affected by save.  Defaults to `true`.
                 */
                    require?: boolean;
            }

            interface ModelSerializeOptions {
                /**
                 * Exclude relations. Defaults to `false`.
                 */
                shallow?: boolean;
                /**
                 * Exclude pivot values. Defaults to `false`.
                 */
                omitPivot?: boolean;
            }

            interface ModelSetOptions {
                /**
                 * Remove attributes instead of setting them.  Defaults to `false`.
                 */
                unset?: boolean;
            }

            interface ModelTimestampOptions {
                /**
                 * Either `'insert'` or `'update'`. Specify what kind of save the attribute update is for.
                 */
                method?: string;
            }

            interface LoadOptions {
                /**
                 * Optionally run the query in a transaction.
                 */
                transacting?: Transaction;
            }

            type CollectionOptions = TODO;
            type CollectionAddOptions = TODO;
            type CollectionRemoveOptions = TODO;
            type CollectionSerializeOptions = TODO;
            type CollectionSetOptions = TODO;
            type CollectionUnshiftOptions = TODO;
            type CollectionAttachOptions = TODO;
            type CollectionDetachOptions = TODO;
            type CollectionUpdatePivotOptions = TODO;
            type CollectionCountOptions = TODO;
            type CollectionCreateOptions = TODO;
            type CollectionFetchOptions = TODO;
            type CollectionFetchOneOptions = TODO;
            type CollectionLoadOptions = TODO;
        }
    }
    export = Bookshelf;

    namespace bookshelf {

        // Import lots of interfaces into local scope so we can reference them concisely.
        import _b = Bookshelf.bookshelf;

        import ModelOptions = _b.ModelOptions;
        import ModelFetchOptions = _b.ModelFetchOptions;
        import ModelFetchAllOptions = _b.ModelFetchAllOptions;
        import ModelSaveOptions = _b.ModelSaveOptions;
        import ModelSerializeOptions = _b.ModelSerializeOptions;
        import ModelSetOptions = _b.ModelSetOptions;
        import ModelTimestampOptions = _b.ModelTimestampOptions;

        import LoadOptions = _b.LoadOptions;

        import CollectionOptions = _b.CollectionOptions;
        import CollectionAddOptions = _b.CollectionAddOptions;
        import CollectionRemoveOptions = _b.CollectionRemoveOptions;
        import CollectionSerializeOptions = _b.CollectionSerializeOptions;
        import CollectionSetOptions = _b.CollectionSetOptions;
        import CollectionUnshiftOptions = _b.CollectionUnshiftOptions;
        import CollectionAttachOptions = _b.CollectionAttachOptions;
        import CollectionDetachOptions = _b.CollectionDetachOptions;
        import CollectionUpdatePivotOptions = _b.CollectionUpdatePivotOptions;
        import CollectionCountOptions = _b.CollectionCountOptions;
        import CollectionCreateOptions = _b.CollectionCreateOptions;
        import CollectionFetchOptions = _b.CollectionFetchOptions;
        import CollectionFetchOneOptions = _b.CollectionFetchOneOptions;
        import CollectionLoadOptions = _b.CollectionLoadOptions;

        import RelatedModel = _b.RelatedModel;
        import RelatedCollection = _b.RelatedCollection;

        /**
         * Version number of bookshelf
         */
        var VERSION: string;

        /**
         * A reference to the Knex.js instance being used by Bookshelf.
         */
        var knex: KnexInstance<TODO>;

        /**
         * An alias to `Knex#transaction`, the `transaction` object must be passed along in the options of any relevant
         * Bookshelf calls, to ensure all queries are on the same connection. The entire transaction block is a promise
         * that will resolve when the transaction is committed, or fail if the transaction is rolled back.
         *
         * @param transactionCallback A transaction block to be provided to `Bookshelf#transaction`.
         */
        function transaction<T>(transactionCallback: (transaction: Transaction) => Promise<T>): Promise<T>;

        // Errors are also exported on bookshelf directly
        var NotFoundError: typeof Model.NotFoundError;
        var NoRowsDeletedError: typeof Model.NoRowsDeletedError;
        var NoRowsUpdatedError: typeof Model.NoRowsUpdatedError;
        var EmptyError: typeof Collection.EmptyError;

        /**
         * Models are simple objects representing individual database rows, specifying the tableName and any relations
         * to other models. They can be extended with any domain-specific methods, which can handle components such as
         * validations, computed properties, and access control.
         */
        class Model extends Events {

            // `extend` method is omitted but unnecessary.  Use Typescript classes instead.

            /**
             * When creating an instance of a model, you can pass in the initial values of the attributes, which will be
             * set on the model. If you define an `initialize` function, it will be invoked when the model is created.
             * @param attributes Initial values for this model's attributes.
             * @param options Hash of options.
             */
            constructor(attributes?: Dictionary<any>, options?: _b.ModelOptions);

            /**
             * Called by the Model constructor when creating a new instance. Override this function to add custom initialization, such as event listeners.
             */
            initialize(attributes: Dictionary<any>, options?: _b.ModelOptions): void;

            /**
             * A simple static helper to instantiate a new Collection, setting the current model as the collection's target.
             */
            static collection<M extends Model>(models?: Array<M>, options?: {}/*TODO*/): Collection<M>;

            /**
             * Gets the number of matching records in the database, respecting any previous calls to query. If a column is provided, records with a null value in that column will be excluded from the count.
             * @param column Specify a column to count - rows with null values in this column will be excluded.
             * @param options Hash of options.
             * @return A promise resolving to the number of matching rows.
             */
            static count(column?: string, options?: {}/*TODO*/): Promise<number>;

            // TODO `static extend()`, doesn't matter when you've got TS classes.

            static fetchAll<M extends Model>(): Promise<Collection<M>>;

            /**
             * A simple helper function to instantiate a new Model without needing new.
             * @param attributes Initial values for this model's attributes.
             * @param options Hash of options.
             */
            static forge<M extends Model>(attributes?: Dictionary<any>, options?: ModelOptions): M;

            /**
             * Sets the current date/time on the timestamps columns `created_at` and `updated_at` for a given method.
             * 'insert' method will only update `updated_at`. To override the default column names, assign an array to
             * `hasTimestamps`. The first element will be the created column name and the second will be the updated
             * column name.
             */
            hasTimestamps: boolean|[string, string];

            /**
             * This tells the model which attribute to expect as the unique identifier for each database row (typically
             * an auto-incrementing primary key named `"id"`). Note that if you are using `parse` and `format` (to have
             * your model's attributes in `camelCase`, but your database's columns in `snake_case`, for example) this
             * refers to the name returned by parse (`myId`), not the database column (`my_id`).
             */
            idAttribute: string;

            /**
             * A required property for any database usage, The `tableName` property refers to the database table name
             * the model will query against.
             */
            tableName: string;

            // TODO constrain Target argument to match M?
            belongsTo<M extends Model>(Target: Ctor<M>, foreignKey?: string): M&RelatedModel<M>;

            belongsToMany<M extends Model>(Target: Ctor<M>, table?: string, foreignKey?: string, otherKey?: string): RelatedCollection<M>;

            /**
             * Clear all attributes on the model.
             * @return This model.
             */
            clear(): this;

            /**
             * Returns a new instance of the model with identical `attributes`, including any relations from the cloned model.
             * @return Cloned instance of this model.
             */
            clone(): this;

            count(column?: string, options?: {}/*TODO*/): Promise<number>;

            destroy(options?: {}/*TODO*/): Promise<TODO>;

            escape(attribute: string): string;

            fetch(options?: ModelFetchOptions): Promise<this|void>;

            fetchAll(options?: ModelFetchAllOptions): Promise<Collection<this>>;

            /**
             * The format method is used to modify the current state of the model before it is persisted to the
             * database. The `attributes` passed are a shallow clone of the `model`, and are only used for
             * inserting/updating - the current values of the model are left intact.
             *
             * @param attributes The attributes to be converted.
             * @return Formatted attributes.
             */
            format(attributes: Dictionary<any>): Dictionary<any>;

            /**
             * Get the current value of an attribute from the model.
             * @param attribute The name of the attribute to retrieve.
             */
            get(attribute: string): any;

            /**
             * Returns `true` if the attribute contains a value that is not null or undefined.
             * @param attribute The attribute to check.
             * @return True if `attribute` is set, otherwise null.
             */
            has(attribute: string): boolean;

            /**
             * Returns true if any `attribute` attribute has changed since the last `fetch`, `save`, or `destroy`. If
             * an attribute is passed, returns true only if that specific attribute has changed.
             * @return `true` if any attribute has changed. Or, if `attribute` was specified, true if it has changed.
             */
            hasChanged(attribute?: string): boolean;

            /**
             * The `hasMany` relation specifies that this model has one or more rows in another table which match on this
             * model's primary key.
             * @param Target Constructor of `Model` targeted by join.
             * @param foreignKey ForeignKey in the `Target` model. By default, the foreignKey is assumed to be the
             * singular form of this model's tableName, followed by `_id` / `_{{idAttribute}}`.
             */
            hasMany<M extends Model>(Target: Ctor<M>, foreignKey?: string): RelatedCollection<M>;

            /**
             * The `hasOne` relation specifies that this table has exactly one of another type of object, specified by a
             * foreign key in the other table.
             * @param Target Constructor of Model targeted by join.
             * @param foreignKey ForeignKey in the `Target` model. By default, the foreignKey is assumed to be the
             * singular form of this model's `tableName`, followed by `_id` / `_{{idAttribute}}`.
             */
            hasOne<M extends Model>(Target: Ctor<M>, foreignKey?: string): M&RelatedModel<M>;

            id: Id;

            /**
             * Checks for the existence of an id to determine whether the model is considered "new".
             */
            isNew(): boolean;

            /**
             * The load method takes an array of relations to eager load attributes onto a `Model`, in a similar way
             * that the `withRelated` property works on `fetch`. Dot separated attributes may be used to specify deep
             * eager loading.
             * @param relations The relation, or relations, to be loaded.
             * @param options Hash of options.
             * @return A promise resolving to this `model`
             */
            load(relations: string|Array<string>, options?: LoadOptions): Promise<this>;

            /**
             * `morphMany` is essentially the same as a `morphOne`, but creating a `collection` rather than a `model`
             * (similar to a `hasOne` vs. `hasMany` relation).
             *
             * `morphMany` is used to signify a `one-to-many` or `many-to-many` `polymorphic relation` with another
             * `Target` model, where the `name` of the model is used to determine which database table keys are used.
             * The naming convention requires the `name` prefix an `_id` and `_type` field in the database. So for the
             * case below the table names would be `imageable_type` and `imageable_id`. The `morphValue` may be
             * optionally set to store/retrieve a different value in the `_type` column than the `Target`'s `tableName`.
             *
             * @param Target Constructor of `Model` targeted by join.
             * @param name Prefix for `_id` and `_type` columns.
             * @param columnNames Array containing two column names, the first is the `_type`, the second is the `_id`.
             * @param morphValue The string value associated with this relationship. Stored in the `_type` column of the
             * polymorphic table. Defaults to `Target#tablename`.
             * @return A collection of related models.
             */
            morphMany<M extends Model>(Target: Ctor<M>, name: string, columnNames: [string, string], morphValue?: string): Collection<M>;
            morphMany<M extends Model>(Target: Ctor<M>, name?: string, morphValue?: string): Collection<M>;

            /**
             * The `morphOne` is used to signify a `one-to-one` `polymorphic relation` with another `Target` model,
             * where the `name` of the model is used to determine which database table keys are used. The naming
             * convention requires the `name` prefix an `_id` and `_type` field in the database. So for the case below
             * the table names would be `imageable_type` and `imageable_id`. The `morphValue` may be optionally set to
             * store/retrieve a different value in the `_type` column than the `Model#tableName`.
             *
             * @param Target Constructor of `Model` targeted by join.
             * @param name Prefix for `_id` and `_type` columns.
             * @param columnNames Array containing two column names, the first is the `_type`, the second is the `_id`.
             * @param morphValue The string value associated with this relationship. Stored in the `_type` column of the
             * polymorphic table. Defaults to `Target#tableName`.
             * @return The related model.
             */
            morphOne<M extends Model>(Target: Ctor<M>, name: string, columnNames: [string, string], morphValue?: string): M;
            morphOne<M extends Model>(Target: Ctor<M>, name?: string, morphValue?: string): M;

            /**
             * The `morphTo` relation is used to specify the inverse of the `morphOne` or `morphMany` relations, where
             * the `targets` must be passed to signify which `models` are the potential opposite end of the `polymorphic
             * relation`.
             *
             * @param name Prefix for `_id` and `_type` columns.
             * @param columnNames Array containing two column names, the first is the `_type`, the second is the `_id`.
             * @param Targets Constructors of `Model` targeted by join.
             */
            morphTo<M extends Model>(name: string, columnNames: [string, string], ...Targets: Array<Ctor<M>>): M;
            morphTo<M extends Model>(name: string, ...Targets: Array<Ctor<M>>): M;

            /**
             * The parse method is called whenever a `model`'s data is returned in a `fetch` call. The function is
             * passed the raw database response object, and should return the `attributes` hash to be `set` on the
             * model. The default implementation is a no-op, simply passing through the JSON response. Override this if
             * you need to format the database responses - for example calling JSON.parse on a text field containing
             * JSON, or explicitly typecasting a boolean in a sqlite3 database response.
             * @param response Hash of attributes to parse.
             * @return Parsed attributes.
             */
            parse(response: Dictionary<any>): Dictionary<any>;

            /**
             * Returns the this previous value of a changed `attribute`, or `undefined` if one had not been specified
             * previously.
             * @param attribute The attribute to check
             * @return The previous value
             */
            previous(attribute: string): any;

            /**
             * Return a copy of the `model`'s previous attributes from the model's last `fetch`, `save`, or `destroy`.
             * Useful for getting a diff between versions of a model, or getting back to a valid state after an error
             * occurs.
             * @return The attributes as they were before the last change.
             */
            previousAttributes(): Dictionary<any>;

            /**
             * The `query` method is used to tap into the underlying Knex query builder instance for the current model.
             * If called with no arguments, it will return the query builder directly. Otherwise, it will call the
             * specified method on the query builder, applying any additional arguments from the `model.query` call. If
             * the method argument is a function, it will be called with the Knex query builder as the context and the
             * first argument, returning the current model.
             */
            query(): QueryBuilder<AbstractClient/*TODO*/, TODO>;
            query(method: string, ...args: Array<any>): this;
            query(fn: (qb: QueryBuilder<AbstractClient/*TODO*/, TODO>) => any): this;
            query(obj: {[method: string]: any}): this;

            /**
             * Update the attributes of a model, fetching it by its primary key. If no attribute matches its
             * `idAttribute`, then fetch by all available fields.
             * @param options A hash of options. See `Model#fetch` for details.
             */
            refresh(options: ModelFetchOptions): Promise<this>;

            /**
             * The `related` method returns a specified relation loaded on the relations hash on the model, or calls
             * the associated relation method and adds it to the relations hash if one exists and has not yet been
             * loaded.
             * @param name The name of the relation to retrieve.
             * @return The specified relation as defined by a method on the model, or undefined if it does not exist.
             */
            related(name: string): Model|Collection<Model>|void;

            relations: Dictionary<RelatedCollection<Model>|RelatedModel<Model>>;

            /**
             * Used to reset the internal state of the current query builder instance. This method is called internally
             * each time a database action is completed by `Sync`
             * @return Self, this method is chainable
             */
            resetQuery(): this;

            /**
             * `save` is used to perform either an insert or update query using the model's set `attributes`.
             *
             * If the model `isNew`, any `defaults` will be set and an `insert` query will be performed. Otherwise it
             * will `update` the record with a corresponding ID. This behaviour can be overridden with the `method`
             * option.
             *
             * If you only wish to update with the params passed to the save, you may pass a {patch: true} flag to the
             * database.
             *
             * Several events fired on the model when saving: a `"creating"`, or `"updating"` event if the model is
             * being inserted or updated, and a "saving" event in either case. To prevent saving the model (with
             * validation, etc.), throwing an error inside one of these event listeners will stop saving the model and
             * reject the promise. A `"created"`, or `Model#"updated"` event is fired after the model is saved, as well
             * as a `"saved"` event either way. If you wish to modify the query when the `"saving"` event is fired, the
             * knex query object should is available in `options.query`.
             * @param key Attribute name.
             * @param val Attribute value.
             * @param attrs A hash of attributes.
             * @param options A hash of options.
             */
            save(key: string, val: any, options?: ModelSaveOptions): Promise<this>;
            save(attrs: Dictionary<any>, options?: ModelSaveOptions): Promise<this>;
            save(): Promise<this>;

            /**
             * Return a copy of the model's `attributes` for JSON stringification. If the `model` has any relations
             * defined, this will also call `ModelBase#toJSON` on each of the related objects, and include them on the
             * object unless `{shallow: true}` is passed as an option.
             *
             * `serialize` is called internally by `toJSON`. Override this function if you want to customize its output.
             */
            serialize(options?: ModelSerializeOptions): Dictionary<any>;

            /**
             * Set a single attribute on the model.
             * @param attribute Attribute name
             * @param value The value to be set.
             * @param options ModelSetOptions
             * @return This model.
             */
            set(attribute: string, value?: any, options?: ModelSetOptions): this;
            /**
             * Set a hash of attributes on the model.
             * @param attributes hash of attribute names and values.
             * @param options ModelSetOptions
             * @return This model.
             */
            set(attributes: Dictionary<any>): this;

            /**
             * Sets the timestamp attributes on the model, if `hasTimestamps` is set to `true` or an array. Check if the
             * model `isNew` or if `{method: 'insert'}` is provided as an option and set the `created_at` and
             * `updated_at` attributes to the current date if it is being inserted, and just the `updated_at` attribute
             * if it's being updated. This method may be overridden to use different column names or types for the
             * timestamps.
             * @return A hash of timestamp attributes that were set.
             */
            timestamp(options?: ModelTimestampOptions): Dictionary<any>;

            /**
             * Called automatically by `JSON.stringify`. To customize serialization, override `serialize`.
             * @param options Options passed to `BaseModel#serialize`.
             */
            toJSON(options?: ModelSerializeOptions): Dictionary<any>;

            /**
             * Remove an attribute from the model. `unset` is a noop if the attribute doesn't exist.
             * @param attribute Attribute to unset.
             * @return This model.
             */
            unset(attribute: string): this;

            /**
             * The where method is used as convenience for the most common `query` method, adding a where clause to the
             * builder. Any additional knex methods may be accessed using `query`.
             *
             * @param key Attribute name
             * @param operator SQL operator (e.g. '==' or '<>')
             * @param value Attribute value
             * @return Self, this method is chainable.
             */
            where(key: string, operator: string, value: any): this;
            /**
             * The where method is used as convenience for the most common `query` method, adding a where clause to the
             * builder. Any additional knex methods may be accessed using `query`.
             *
             * @param key Attribute name
             * @param value Attribute value
             * @return Self, this method is chainable.
             */
            where(key: string, value: any): this;
            /**
             * The where method is used as convenience for the most common `query` method, adding a where clause to the
             * builder. Any additional knex methods may be accessed using `query`.
             *
             * @param attributes A hash of attributes to match.  Note that these must be formatted as they are in the
             * database, not how they are stored after `Model#parse`.
             * @return Self, this method is chainable.
             */
            where(attributes: Dictionary<any>): this;

            // TODO properly type these methods
            invert: any;
            keys: any;
            omit: any;
            pairs: any;
            pick: any;
            values: any;

            // TODO finish typing these
            /* TODO add typings for `trigger` and `triggerThen`?  No, because these events should only be triggered by
             * bookshelf itself, not by consumer code.
             */
            on  (name: 'fetched:collection', callback: (collection, resp, options) => Promise<any>): this;
            once(name: 'fetched:collection', callback: (collection, resp, options) => Promise<any>): this;
            on  (name: 'fetching:collection', callback: (collection, columns, options) => Promise<any>): this;
            once(name: 'fetching:collection', callback: (collection, columns, options) => Promise<any>): this;
            on  (name: 'created', callback: (model, attrs, options) => Promise<any>): this;
            once(name: 'created', callback: (model, attrs, options) => Promise<any>): this;
            on  (name: 'creating', callback: (model, attrs, options) => Promise<any>): this;
            once(name: 'creating', callback: (model, attrs, options) => Promise<any>): this;
            on  (name: 'destroyed', callback: (model, attrs, options) => Promise<any>): this;
            once(name: 'destroyed', callback: (model, attrs, options) => Promise<any>): this;
            on  (name: 'destroying', callback: (model, attrs, options) => Promise<any>): this;
            once(name: 'destroying', callback: (model, attrs, options) => Promise<any>): this;
            on  (name: 'fetched', callback: (model, response, options) => Promise<any>): this;
            once(name: 'fetched', callback: (model, response, options) => Promise<any>): this;
            on  (name: 'fetching', callback: (model, columns, options) => Promise<any>): this;
            once(name: 'fetching', callback: (model, columns, options) => Promise<any>): this;
            on  (name: 'saved', callback: (model, resp, options) => Promise<any>): this;
            once(name: 'saved', callback: (model, resp, options) => Promise<any>): this;
            on  (name: 'saving', callback: (model, attrs, options) => Promise<any>): this;
            once(name: 'saving', callback: (model, attrs, options) => Promise<any>): this;
            on  (name: 'updated', callback: (model, attrs, options) => Promise<any>): this;
            once(name: 'updated', callback: (model, attrs, options) => Promise<any>): this;
            on  (name: 'updating', callback: (model, attrs, options) => Promise<any>): this;
            once(name: 'updating', callback: (model, attrs, options) => Promise<any>): this;
            on  (name: string, callback: Function): this;
            once(name: string, callback: Function): this;
        }

        namespace Model {
            /**
             * Thrown when no records are found by `Model#fetch` or `Model#refresh` when called with the
             * `{require: true}` option.
             */
            class NotFoundError extends ErrorConstructor {}
            /**
             * Thrown when no record is deleted by `destroy` if called with the `{require: true}` option.
             */
            class NoRowsDeletedError extends ErrorConstructor {}
            /**
             * Thrown when no records are saved by `save` unless called with the `{require: false}` option.
             */
            class NoRowsUpdatedError extends ErrorConstructor {}
        }


        /**
         * Base class for all Bookshelf collections
         */
        class Collection<M extends Model> extends Events {

            // `extend` method is omitted but unnecessary.  Use Typescript classes instead.

            // TODO copy this JSDoc for both ctors and forge()
            constructor(models: Array<M>, options?: CollectionOptions);
            constructor(options?: CollectionOptions);
            static forge<M extends Model>(models: Array<M>, options?: CollectionOptions): Collection<M>;
            static forge<M extends Model>(options?: CollectionOptions): Collection<M>;
            initialize(models: Array<M>, options?: CollectionOptions): any;
            initialize(options?: CollectionOptions): any;

            add(models: Dictionary<any>|M|Array<Dictionary<any>|M>, options?: CollectionAddOptions): this;

            at(index: number): M;

            clone(): this;

            count(column?: string, options?: CollectionCountOptions): Promise<number>;
            count(options: CollectionCountOptions): Promise<number>;

            create(model: Dictionary<any>, options?: CollectionCreateOptions): Promise<M>;

            fetch(options?: CollectionFetchOptions): Promise<this>;

            fetchOne(options?: CollectionFetchOneOptions): Promise<Model>;

            findWhere(attrs: Dictionary<any>): M;

            where(attrs: Dictionary<any>): Array<M>;
            where(attrs: Dictionary<any>, first: boolean): M|Array<M>;

            get(id: Id|Model): M;

            invokeThen(method: string, ...args: Array<any>): Promise<Array<any>>;

            load(relations: string|Array<string>, options?: CollectionLoadOptions): Promise<this>;

            parse(resp: Array<Dictionary<any>>): Array<Dictionary<any>>;

            pluck(attr: string): Array<any>;

            pop(options?: CollectionRemoveOptions): M;

            push(model: M, options?: CollectionAddOptions): this;

            query(): QueryBuilder<AbstractClient/*TODO*/, TODO>;
            query(method: string, ...args: Array<any>): this;
            query(fn: (qb: QueryBuilder<AbstractClient/*TODO*/, TODO>) => any): this;
            query(obj: {[method: string]: any}): this;

            reduceThen<T>(iterator: (prev: T|M, curr: M, index: number, arrayLength: number) => T|PromiseLike<T>): Promise<T|M>;
            reduceThen<T>(iterator: (prev: T, curr: M, index: number, arrayLength: number) => T|PromiseLike<T>, initialValue: T, context?: any): Promise<T>;

            remove(models: Id|Model|Array<Id|Model>, options?: CollectionRemoveOptions): Id|Model|Array<Id|Model>;

            reset(models?: Dictionary<any>|M|Array<Dictionary<any>|M>, options?: CollectionAddOptions): Array<M>;

            resetQuery(): this;

            serialize(options?: CollectionSerializeOptions): Array<Dictionary<any>>;

            set(models: Dictionary<any>|M|Array<Dictionary<any>|M>, options?: CollectionSetOptions): this;

            shift(options?: CollectionRemoveOptions): M;

            slice(begin?: number, end?: number): Array<M>;

            toJSON(options?: CollectionSerializeOptions): Array<Dictionary<any>>;

            unshift(model: M|Dictionary<any>, options?: CollectionUnshiftOptions): this;

            // TODO event-specific signatures for on() and once()

            // TODO properly type these methods
            forEach: any;
            each: any;
            map: any;
            collect: any;
            reduce: any;
            foldl: any;
            inject: any;
            reduceRight: any;
            foldr: any;
            find: any;
            detect: any;
            filter: any;
            select: any;
            reject: any;
            every: any;
            all: any;
            some: any;
            any: any;
            include: any;
            contains: any;
            invoke: any;
            max: any;
            min: any;
            toArray: any;
            size: any;
            first: any;
            head: any;
            take: any;
            initial: any;
            rest: any;
            tail: any;
            drop: any;
            last: any;
            without: any;
            difference: any;
            indexOf: any;
            shuffle: any;
            lastIndexOf: any;
            isEmpty: any;
            chain: any;
            groupBy: any;
            countBy: any;
            sortBy: any;
        }

        namespace Collection {
            /**
             * Thrown when no records are found by `Collection#fetch` or `Model#fetchAll`,
             * when called with the `{require: true}` option.
             */
            class EmptyError extends ErrorConstructor {}
        }


        // Implementation of the `Events` class
        function on(event: string, listener: Function): typeof bookshelf;
        function once(event: string, listener: Function): typeof bookshelf;
        function off(name?: string, callback?: Function): typeof bookshelf;
        function trigger(name: string, ...args: Array<any>): typeof bookshelf;
        function triggerThen(name: string, ...args: Array<any>): Promise<Array<any>>;
    }


    // Is not exported anywhere
    class Events {

        /**
         * Register an event listener.
         * @param name The event name, or a whitespace-separated list of event names, to be registered.
         * @param callback The callback function to be executed when the event is triggered.
         * @return This object, for chaining.
         */
        on(name: string, callback: Function): this;

        /**
         * Register a one-off event handler.
         * @param name The event name, or a whitespace-separated list of event names, to be registered.
         * @param callback The callback function to be executed when the event is triggered.
         * @return This object, for chaining.
         */
        once(name: string, callback: Function): this;

        /**
         * Deregister an event listener.
         * If callback is omitted, all registered callbacks for the named events are removed.  If name is omitted,
         * all event listeners are deregistered.
         * @param name The event name, or a whitespace-separated list of event names, to be deregistered.
         * @param callback The previously-registered callback function.
         * @return This object, for chaining.
         */
        off(name?: string, callback?: Function): this;

        /**
         * Trigger all registered callbacks for the named event(s).
         * @param name The event name, or a whitespace-separated list of event names, to be triggered.
         * @param args
         * @return This object, for chaining.
         */
        trigger(name: string, ...args: Array<any>): this;

        /**
         * A promise version of `Events#trigger`, returning a promise which resolves with all return values from
         * triggered event handlers. If any of the event handlers throw an `Error` or return a rejected promise, the
         * promise will be rejected. Used internally on the `"creating"`, `"updating"`, `"saving"`, and
         * `"destroying"` events, and can be helpful when needing async event handlers (for validations, etc).
         *
         * @param name The event name, or a whitespace-separated list of event names, to be triggered.
         * @param args Arguments to be passed to any registered event handlers.
         * @return A promise resolving the the resolved return values of any triggered handlers.
         */
        triggerThen(name: string, ...args: Array<any>): Promise<Array<any>>;

    }

}

