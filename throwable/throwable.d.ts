// Type definitions for node-throwable v1.0.3
// Project: https://github.com/Joris-van-der-Wel/node-throwable
// Definitions by: Andrew Bradley <https://github.com/cspotcode/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module "throwable" {

    /**
     * Inherit from Error without performance penalties, `instanceof` behaves as expected and the error stack is correct.
     * This module can be used cross-browser using Browserify.
     */
    class Throwable extends Error {
        /**
         * Constructs a new Throwable by wrapping around an Error() (a decorator).
         * All of Error's properties and methods are proxied to this wrapped Error.
         * This ensures the "stack" is correct without having to inspect this stack
         * during the construction of Throwable (which would have been slow).
         * Throwable has its prototype chained to Error, which means that (new Throwable()
         * instanceof Error) is true.
         * You can inherit from this class by using normal prototype chaining
         * (for example using util.inherits). Make sure you also call the Throwable
         * constructor function in your own constructor.
         *
         * Example:
         *     throw new Throwable(Error('Hrm'));
         */
        constructor(wrapped: Error);
    }

    // Typescript won't let us `import * as Throwable from 'throwable';` *unless* Throwable is declared as a module.
    // It cannot merely be declared as a class.
    module Throwable {}

    export = Throwable;
}