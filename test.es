#! /usr/bin/env node node_modules/.bin/babel-node
"use strict";

// Run some basic sanity checks that this repo is in good order.

import glob from 'glob';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';


_.chain(glob.sync('*/')).without([
    'node_modules'
]).each(dir => {
    const typings = path.join(dir, 'typings.json');
    if(!fs.existsSync(typings)) {
        error(`Missing typings.json for ${dir}`);
    } else {
        const json = getJSON(typings);
        if(json.name !== dir.slice(0, -1)) error(`typings.json for "${dir}" has wrong name`);
        if(!fs.existsSync(path.join(typings, '..', json.main))) error(`typings.json points to nonexistent main .d.ts`);
    }
});

///////////////////////////////

function getJSON(path) {
    const content = fs.readFileSync(path, 'utf-8');
    try {
        return JSON.parse(content);
    } catch(e) {}
    return undefined;
}

function error(message) {
    console.log(message);
}
