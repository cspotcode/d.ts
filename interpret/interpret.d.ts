// Type definitions for interpret
// Project: https://github.com/js-cli/js-interpret
// Definitions by: Andrew Bradley <https://github.com/cspotcode>

declare type TODO = any;

export var extensions: Extensions;
export var jsVariants: Extensions;
export interface Extensions {
    [extension: string]: Extension;
}
export type Extension = string | Array<string> | AdvancedExtension;
export interface AdvancedExtension {
    module: string;
    register: (module: any) => void;
}
