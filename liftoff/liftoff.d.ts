// Type definitions for liftoff
// Project: https://github.com/js-cli/js-liftoff
// Definitions by: Andrew Bradley <https://github.com/cspotcode>

import * as interpret from 'interpret';
import {EventEmitter} from 'events';

declare type TODO = any;

declare class Liftoff extends EventEmitter {
    constructor(options: Liftoff.Options);

    launch(options: Liftoff.LaunchOptions, invoke: (env: Liftoff.Environment) => void): void;
}

declare namespace Liftoff {
    interface Options {
        /**
         * Sugar for setting processTitle, moduleName, configName automatically.
         * Default: null
         */
        name?: string;
        /**
         * Sets what the process title will be.
         * Default: null
         */
        processTitle?: string;
        /**
         * Sets which module your application expects to find locally when being run.
         * Default: null
         */
        moduleName?: string;
        /**
         * Sets the name of the configuration file Liftoff will attempt to find. Case-insensitive.
         * Default: null
         */
        configName?: string;
        /**
         * Set extensions to include when searching for a configuration file.
         * If an external module is needed to load a given extension
         * (e.g. .coffee), the module name should be specified as the value for
         * the key.
         *
         * Default: {".js":null,".json":null}
         */
        extensions?: interpret.Extensions;
        /**
         * Flags that are intended for v8, not for our script.  When these are
         * detected, liftoff will re-spawn our script, passing these flags to
         * v8.
         */
        v8flags?: Array<string> | TODO; // Or require('v8flags')?  What does that mean?
        /**
         * A method to handle bash/zsh/whatever completions.
         * Default: null
         */
        completions?: (a: TODO) => TODO;
    }

    interface LaunchOptions {
        cwd?: string;
        configPath?: string;
        /**
         * A string or array of modules to attempt requiring from the local working directory before invoking the launch callback.
         * Default: null
         */
        require?: string | Array<string>;
        callback: (env: Environment) => void;
        //callback: <this extends Liftoff>(env: Environment) => void; // This signature will work in Typescript 2.0
    }

    interface Environment {
        cwd: string;
        require: Array<string>;
        configNameSearch: TODO;
        configPath: string;
        configBase: string;
        modulePath: string;
        /**
         * the contents of the local module's package.json (if found)
         */
        modulePackage: TODO;
    }
}

export = Liftoff;
