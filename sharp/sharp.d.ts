// Type definitions for sharp
// Project: https://github.com/lovell/sharp
// Definitions by: Andrew Bradley <https://github.com/cspotcode/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../node/node.d.ts" />
/// <reference path="../color/color.d.ts" />

declare module "sharp" {

    import stream = require('stream');
    import color = require('color');


    type Gravity = number;
    type Interpolator = string;
    type Color = string|color.RgbDictionary|color.HslDictionary|color.HsvDictionary|color.CmykDictionary;


    // Constructor

    function sharp(input?: string|Buffer): sharp.Transformer;


    module sharp {

        var gravity: {
            center: Gravity;
            centre: Gravity;
            north: Gravity;
            east: Gravity;
            south: Gravity;
            west: Gravity;
        };


        var interpolator: {
            nearest: Interpolator;
            bilinear: Interpolator;
            bicubic: Interpolator;
            vertexSplitQuadraticBasisSpline: Interpolator;
            locallyBoundedBicubic: Interpolator;
            nohalo: Interpolator;
        };


        var format: {
            [name: string]: Format;
        };


        function cache(memory?: number, items?: number): CacheStats;

        interface CacheStats {
            current: number;
            high: number;
            memory: number;
            items: number;
        }


        function concurrency(threads?: number): number;


        function counters(): Counters;

        interface Counters {
            queue: number;
            process: number;
        }

        // type of `sharp.format`'s properties

        interface Format {
            id: string;
            input: FormatInputOutput;
            output: FormatInputOutput;
        }


        interface FormatInputOutput {
            file: boolean;
            buffer: boolean;
            stream: boolean;
        }


        interface Metadata {
            format: string;
            width: number;
            height: number;
            space: string;
            channels: number;
            hasProfile: boolean;
            hasAlpha: boolean;
            orientation: number;
        }


        interface Transformer extends stream.Duplex {

            // Input methods

            metadata(callback: (err: any, metadata: Metadata) => void): void;
            metadata(): Promise<Metadata>;
            sequentialRead(): Transformer;
            limitInputPixels(pixels: number): Transformer;

            // Transformation options

            resize(width: number, height?: number): Transformer;
            extract(top: number, left: number, width: number, height: number): Transformer;
            crop(gravity?: Gravity): Transformer;
            max(): Transformer;
            min(): Transformer;
            ignoreAspectRatio(): Transformer;
            background(rgba: Color): Transformer;
            embed(): Transformer;
            flatten(): Transformer;
            rotate(angle?: number): Transformer;
            flip(): Transformer;
            flop(): Transformer;
            withoutEnlargement(): Transformer;
            blur(sigma?: number): Transformer;
            sharpen(radius?: number, flat?: number, jagged?: number): Transformer;
            interpolateWith(interpolator: Interpolator): Transformer;
            gamma(gamma?: number): Transformer;
            grayscale(): Transformer;
            greyscale(): Transformer;
            normalize(): Transformer;
            normalise(): Transformer;

            // Output options

            jpeg(): Transformer;
            png(): Transformer;
            webp(): Transformer;
            raw(): Transformer;
            toFormat(format: Format|string): Transformer;
            quality(quality: number): Transformer;
            progressive(): Transformer;
            withMetadata(): Transformer;
            tile(size?: number, overlap?: number): Transformer;
            withoutChromaSubsampling(): Transformer;
            trellisQuantisation(): Transformer;
            trellisQuantization(): Transformer;
            overshootDeringing(): Transformer;
            optimiseScans(): Transformer;
            optimizeScans(): Transformer;
            compressionLevel(compressionLevel: number): Transformer;
            withoutAdaptiveFiltering(): Transformer;

            // Output methods

            toFile(filename: string, callback: (err: any, info: ImageOutputInfo) => void): void;
            toFile(filename: string): Promise<ImageOutputInfo>;

            toBuffer(callback: (err: any, buffer: Buffer, info: ImageOutputInfo) => void): void;
            toBuffer(): Promise<Buffer>;

        }


        interface ImageOutputInfo {
            format: string;
            size: number;
            width: number;
            height: number;
        }

    }


    export = sharp;

}