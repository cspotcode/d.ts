// Type definitions for hubot v2.19.0
// Project: https://github.com/github/hubot
// Definitions by: Andrew Bradley <https://github.com/cspotcode/>

import {EventEmitter} from 'events';
type TODO = any;
type Dictionary<T> = {[key: string]: T};

export class Robot {

    /** Private constructor?  I'm not sure */
    constructor(adapterPath: string, adapterName: string, enableHttpd: boolean, botName: string, botAlias: string);

    /**
     * called anytime a message's text matches the pattern
     */
    hear(pattern: RegExp, handler: (res: Response) => void): void;
    hear(pattern: RegExp, options: TODO, handler: (res: Response) => void): void;
    /**
     * called for messages that are immediately preceded by the robot's name or alias
     */
    respond(pattern: RegExp, handler: (res: Response) => void): void;
    respond(pattern: RegExp, options: TODO, handler: (res: Response) => void): void;
    /**
     * Called when the room's topic changes, if the adapter supports it
     */
    topic(handler: (res: Response) => void): void;
    /**
     * Called when someone joins the chat, if the adapter supports it
     * */
    enter(handler: (res: Response) => void): void;
    /**
     * Called when someone leaves the chat, if the adapter supports it
     * */
    leave(handler: (res: Response) => void): void;
    listen(matchFunction: (message: string) => boolean, handler: (res: Response) => void): void;
    /** A scoped http client instance(?) for making http requests */
    http: TODO;
    /** An express router */
    router: TODO;

    on(event: string, listener: Function): this;
    emit(event: string, ...args: any[]): boolean;
    // TODO add strong typing to events?
    /*
        * Events:
        * 'error'
        * 'running'
        */

    brain: Brain;

    listenerMiddleware(middleware: (context: ListenerMiddlewareContext, next: TODO, done: TODO) => void): void;
    receiveMiddleware(middleware: (context: ReceiveMiddlewareContext, next: TODO, done: TODO) => void): void;
    responseMiddleware(middleware: (context: ResponseMiddlewareContext, next: TODO, done: TODO) => void): void;

    logger: TODO;

    run(): void;
    shutdown(): void;

    loadFile(path: string, file: string): void;
    load(path: string): void;
    loadHubotScripts(path: string, scripts: TODO): void;
    loadExternalScripts(packages: TODO): void;

    name: string;
}
export type ListenerMiddlewareContext = TODO;
export type ReceiveMiddlewareContext = TODO;
export type ResponseMiddlewareContext = TODO;

export class Response {
    send(message: string): void;
    reply(message: string): void;
    emote(message: string): void;
    match: RegExpMatchArray;
    random(options: Array<string>): string;
    message: Message;
}

// TODO is this the same as User?
export class Message {
    // TODO Which subclass does this go in?
    user: User;
    room: string;
    text: string;
}

export class TextMessage extends Message {
    
}
export class EnterMessage extends Message {
    
}
export class LeaveMessage extends Message {
    
}
export class TopicMessage extends Message {
    
}
export class CatchAllMessage extends Message {
    
}

/**
 * Emits:
 *   'save', this.data
 *   'close'
 *   'loaded', this.data
 */
export class Brain extends EventEmitter {
    get(key: string): any;
    set(key: string, value: any): this;
    set(pairs: Dictionary<any>): void;
    remove(key: string): this;
    close(): void;
    setAutoSave(enabled: boolean): boolean;
    resetSaveInterval(seconds: number): TODO;
    mergeData(data: TODO): TODO;
    users(): Array<User>;
    userForId(id: string, options: Dictionary<any>): User;
    userForName(name: string): User;
    usersForRawFuzzyName(fuzzyName: string): Array<User>;
    usersForFuzzyName(fuzzyName: string): Array<User>;

    /* private */data: {
        users: TODO;
        _private: Dictionary<any>;
    }
    /* private */ autoSave: boolean;

}

export class Adapter extends EventEmitter {
    robot: Robot;
    send(envelope: Envelope, ...strings: Array<string>): void;
    reply(envelope: Envelope, ...strings: Array<string>): void;
    topic(envelope: Envelope, ...strings: Array<string>): void;
    play(envelope: Envelope, ...strings: Array<string>): void;

    run(): void;
    close(): void;

    receive(message: Message): void;
}

/** An object with message, room, and user details */
export interface Envelope {
    room?: string;
    user?: User;
    message?: Message;
}

export class User {
    id: string;
    name: string;
    room: string;
}

/**
 * @param adapterPath path to built-in adapters
 * 
 */
export function loadBot(adapterPath: string, adapterName: string, enableHttpd: boolean, botName: string, botAlias: string): Robot;
