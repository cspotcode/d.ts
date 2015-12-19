// Type definitions for Validate.js v0.9.0
// Project: http://validatejs.org/
// Definitions by: Andrew Bradley <https://github.com/cspotcode/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

// TODO add all `validators.<validator name>.message` variables

declare module "validate.js" {

    type Dictionary<T> = {[k: string]: T};

    function ValidateStatic(attributes: ValidateStatic.AttributesSource, constraints: ValidateStatic.Constraints, options?: ValidateStatic.Options): ValidateStatic.ValidationErrors;

    namespace ValidateStatic {
        /** Set this to apply default options for all calls to `validate()` */
        var options: Options;

        /**
         * Returns a promise that is resolved if the validation passes; rejected if it fails.  Value passed to the
         * rejection handler is ValidationErrors
         */
        function async(attributes: AttributesSource, constraints: Constraints, options?: AsyncOptions): PromiseLike<void>;

        namespace async {
            /** Set this to apply default options for all calls to `validate.async()` */
            var options: AsyncOptions;
        }

        function single(value: any, constraints: SingleConstraints, options?: Options): FlatValidationErrors;

        /**
         * Optionally override this with whatever Promise constructor implementation you'd like validate.js to use.  If
         * unassigned, validate.js tries to use the global `Promise`
         * Note: do not use jQuery's promise implementation; it doesn't work because it's not A+ compatible.
         */
        var Promise: PromiseConstructorLike;

        type AttributesSource = Attributes|HTMLFormElement|JQuery;

        interface Attributes {
            [attributeName: string]: any;
        }

        /**
         * Constraints for an entire object with multiple attributes
         */
        interface Constraints {
            [attribute: string]: SingleConstraints
        }

        /**
         * Constraints for a single value
         */
        interface SingleConstraints {
            date?: validators.date.Options;
            datetime?: validators.datetime.Options;
            email?: validators.email.Options;
            equality?: validators.equality.Options;
            exclusion?: validators.exclusion.Options;
            format?: validators.format.Options;
            inclusion?: validators.inclusion.Options;
            length?: validators.length.Options;
            numericality?: validators.numericality.Options;
            presence?: validators.presence.Options;
            url?: validators.url.Options;
            [validator: string]: any;
        }

        /**
         * Options for `validate`
         */
        interface Options {
            fullMessages?: boolean;
            /** One of either "grouped", "flat", or "detailed" */
            format?: string;
        }

        /**
         * Options for `validate.async`
         */
        interface AsyncOptions extends Options {
            cleanAttributes?: boolean;
            wrapErrors?: {
                (errors: GroupedValidationErrors, options: AsyncOptions, attributes: AttributesSource, constraints: Constraints): any;
            }|{
                new (errors: GroupedValidationErrors, options: AsyncOptions, attributes: AttributesSource, constraints: Constraints): any;
            };
        }

        /**
         * Returned by `validate` when validation fails.
         */
        type ValidationErrors  = DetailedValidationErrors|FlatValidationErrors|GroupedValidationErrors;

        /**
         * Returned by `validate` when you pass the option `{format: 'detailed'}`
         */
        type DetailedValidationErrors = Array<DetailedValidationError>;

        /**
         * Object describing a single validation error.  An array of these are returned when you pass the option `{format: 'detailed'}`
         */
        interface DetailedValidationError {
            attribute: string;
            value: any;
            validator: string;
            globalOptions: AsyncOptions;
            attributes: Attributes;
            options: any;
            error: string;
        }

        /**
         * Returned by `validate` when you pass the option `{format: 'flat'}`
         */
        type FlatValidationErrors = Array<string>;

        /**
         * Returned by `validate` when you pass the option `{format: 'grouped'}` or do not specify a format.
         */
        interface GroupedValidationErrors {
            [attributeName: string]: Array<string>;
        }

        /**
         * Function that's in your constraints object and will be called by validate.js to compute the desired value.
         */
        interface ComputeValueFn {
            (value: any, attributes: {[k: string]: any}, attributeName: string, options: any, constraints: Constraints): any;
        }

        /**
         * Used by validate to convert values into strings before inserting them into error messages.
         * By default, delegates to `prettify()`.
         */
        function stringifyValue(value: any): string;

        interface ValidatorFn<Options> {
            (value: any, options: Options, key: string, attributes: AttributesSource, globalOptions: AsyncOptions):
                string|Array<string>|PromiseLike<string>|PromiseLike<Array<string>>;
        }

        /*
         * UTILITIES
         */

        function capitalize(s: string): string;

        function cleanAttributes(attributes: Attributes, whitelist: {[attributeName: string]: any}): Attributes;

        function collectFormValues(rootElement: HTMLElement/*TODO*/, options?: CollectFormValuesOptions): Attributes;

        interface CollectFormValuesOptions {
            nullify?: boolean;
            trim?: boolean;
        }

        function contains<T>(collection: Array<T>|{[k: string]: T}, value: T): boolean;

        function extend(target: {}, ...sources: Array<{}>): {};

        function format(formatString: string, values: {}): string;

        function getDeepObjectValue(object: any, keypath: string): any;

        function isArray(v: any): v is Array<any>;

        function isDate(v: any): v is Date;

        /**
         * Check if the given value is not null or undefined.
         */
        function isDefined(v: any): boolean;

        // TODO should this be `v is HTMLElement`?
        function isDomElement(v: any): v is Element;

        /**
         * Check if the given value is non empty. The following value are considered empty:
         * - null
         * - undefined
         * - Empty strings
         * - Whitespace only strings
         * - Empty arrays
         * - Empty objects
         */
        function isEmpty(v: any): boolean;

        function isFunction(v: any): v is Function;

        function isInteger(v: any): v is number;

        /**
         * Check if the given value is a number. Unlike most isNumber checks this function does not consider NaN to be a
         * number.
         */
        function isNumber(v: any): v is number;

        /**
         * Check if the given value is an object. This function considers arrays objects so be careful if this matters
         * to you.
         */
        function isObject(v: any): v is {};

        /**
         * Check if the given value is a promise. This used the same semantics as the ECMAScript spec which means that
         * any non empty object that has a .then function is a promise.
         */
        function isPromise(v: any): v is PromiseLike<any>;

        function isString(v: any): v is string;

        /**
         * Provides a way to clean up strings so that they become human readable.
         *
         * It is meant to prettify things like attribute names and other programming related entities. It will do the
         * following things:
         *
         * - Split words divided by `.`
         * - Remove backslashes
         * - Replace `_` and `-` with spaces
         * - Split cameled cased words
         * - Make the whole string lower case
         * - Converts number to strings with no more than 2 decimals
         * - Calls `toString` on objects
         * - Joins arrays with `,` and calls prettify on all items
         *
         * **Important! It does not removing leading or trailing period since these are not considered separators.**
         */
        function prettify(value: any): string;

        /**
         * Calls the value with the specified arguments and returns the result if it's a function otherwise it simply
         * returns the value.
         *
         * This is used in validate.js in places where for example options can be either an object or a function
         * returning the options.
         *
         * **Important! Since the function is detached it is not called with a specific context, therefor this only
         * works when the value is a pure function.**
         */
        function result(valueOrFn: any, ...args: Array<any>): any;

        var validators: {

            // Declare all variables here

            email: ValidatorFn<validators.email.Options> & {
                PATTERN: RegExp;
            };

            [validatorName: string]: ValidatorFn<any>;
        };

        export namespace validators {

            // Declare only non-variables here!  (e.g. interfaces)
            // Variables must go above in the `var validators` interface

            interface CommonOptions {
                message?: string;
            }

            export namespace date {
                export type Options = boolean|OptionBag;
                export interface OptionBag extends CommonOptions {

                }
            }

            namespace datetime {
                type Options = boolean|OptionBag;
                interface OptionBag extends CommonOptions {

                }
            }

            namespace email {
                type Options = boolean|OptionBag;
                interface OptionBag extends CommonOptions {

                }
            }

            namespace equality {
                type Options = string|OptionBag;
                interface OptionBag extends CommonOptions {
                    attribute: string;
                    comparator?: (v1: any, v2: any) => boolean;
                }
            }

            /*
             * Inclusion and exclusion have identical options
             */
            namespace exclusion {
                type Options = Array<any>|OptionBag;
                interface OptionBag extends CommonOptions {
                    within: Array<any>|Dictionary<any>;
                }
            }
            namespace inclusion {
                type Options = Array<any>|OptionBag;
                interface OptionBag extends CommonOptions {
                    within: Array<any>|Dictionary<any>;
                }
            }

            namespace format {
                type Options = RegExp|string|OptionBag;
                interface OptionBag extends CommonOptions {
                    pattern: RegExp|string;
                    flags?: string;
                }
            }
            namespace length {
                type Options = OptionBag;
                interface OptionBag extends CommonOptions {
                    is?: number;
                    minimum?: number;
                    maximum?: number;
                    wrongLength?: string;
                    tooShort?: string;
                    tooLong?: string;
                    tokenizer?: (v: any) => {length: number}
                }
            }
            namespace numericality {
                type Options = boolean|OptionBag;
                interface OptionBag extends CommonOptions {
                    noStrings?: boolean;
                    onlyInteger?: number;
                    greaterThan?: number;
                    greaterThanOrEqualTo?: number;
                    equalTo?: number;
                    lessThanOrEqualTo?: number;
                    lessThan?: number;
                    odd?: boolean;
                    even?: boolean;
                    notValid?: string;
                    notInteger?: string;
                    notGreaterThan?: string;
                    notGreaterThanOrEqualTo?: string;
                    notEqualTo?: string;
                    notLessThan?: string;
                    notLessThanOrEqualTo?: string;
                    notOdd?: string;
                    notEven?: string;
                }
            }
            namespace presence {
                type Options = boolean|OptionBag;
                interface OptionBag extends CommonOptions {}
            }
            namespace url {
                type Options = boolean|OptionBag;
                interface OptionBag extends CommonOptions {
                    schemes?: Array<string>;
                    allowLocal?: boolean;
                }
            }
        }
    }

    export = ValidateStatic;
}