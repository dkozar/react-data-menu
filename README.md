[![NPM](https://nodei.co/npm/react-data-menu.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/react-data-menu)

[![NPM](https://badge.fury.io/js/react-data-menu.png)](https://www.npmjs.com/package/react-data-menu)

# React Data Menu

Smart data-driven menu rendered in an overlay.

Hints-based aligning with custom renderers and factories.

Never clipped by other components or screen edges.

[![Data Menu!](http://dankokozar.com/images/react-data-menu.png)](http://dkozar.github.io/react-data-menu/)

## :gear: Maintainance

React 0.14: https://github.com/dkozar/react-data-menu/commits/react-0.14

## :tv: Demo

http://dkozar.github.io/react-data-menu/

## :tv: Video

https://www.youtube.com/watch?v=TvtC0xsn6ig

## :zap: Usage

```js
// ES6
import React, { Component } from 'react';
import { LinkRenderer } from './renderers/LinkRenderer.js';
import { Menu } from 'react-data-menu';

function callback(item) {
    console.log('item clicked', item);
}

export class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            position: {
                x: 100,
                y: 100
            },
            items: {
                type: 'label',
                title: 'Menu Popup 1'
            }, '-', {
                title: 'Menu item 1-1',
                callback: callback,
                items: [{ // sub-menu
                    title: 'Menu Popup 2'
                }, '-', {
                    title: 'Menu item 2-1',
                    callback: callback,
                    items: [{ // sub-sub-menu
                        title: 'Menu Popup 3'
                    }, '-', {
                        title: 'Menu item 3-1'
                    }]
                }]
            }, {
                title: 'Menu item 1-2'
            }, '-', {
                 type: 'link',
                 title: 'Give me the stars!',
                 url: 'https://github.com/dkozar/react-data-menu/stargazers',
                 target: '_blank'
            }];
        };
    }

    render() {
        var renderers = {
            'link': LinkRenderer
        };
    
        return (
            <Menu items={this.state.items} position={this.state.position} renderers={renderers} />
        );
    }
}

render(<App />, document.body);
```

## :truck: Installation

### Option A - use it as NPM plugin:

```bash
npm install react-data-menu --save
```

This will install the package into the *node_modules* folder of your project.

### Option B - download the project source:

```bash
git clone https://github.com/dkozar/react-data-menu.git
cd react-data-menu
npm install
```

*npm install* will install all the dependencies (and their dependencies) into the *node_modules* folder.

Then, you should run one of the builds.

## :factory: Builds

### :rocket: Hot-loader development build

```bash
npm start
open http://localhost:3000
```

This will give you the build that will partially update the browser via *webpack* whenever you save the edited source file.

Additionally, it will keep the React component state *intact*.

For more info on React hot-loader, take a look into [this fantastic video](https://www.youtube.com/watch?v=xsSnOQynTHs).

### :helicopter: Demo build

```bash
npm run demo
```
This should build the minified *demo* folder (it's how the [demo](http://dkozar.github.io/react-data-menu/) is built).

```bash
npm run debug
```
This should build the non-minified *demo* folder (for easier debugging).

You could install the http-server for running demo builds in the browser:

```bash
npm install http-server
http-server
```

### :steam_locomotive: Additional builds

```bash
npm run build
```

Runs Babel on source files (converting ES6 and React to JS) and puts them into the *build* folder.

```bash
npm run dist
```

Builds the webpackUniversalModuleDefinition and puts it into the *dist* folder.

```bash
npm run all
```

Runs all the builds: *build* + *dist* + *demo*.

```bash
npm run test
```

Runs the tests.

## :thumbsup: Thanks to:

:rocket: [React Transform Boilerplate](https://github.com/gaearon/react-transform-boilerplate) for the workflow.

[![Downloads!](https://nodei.co/npm-dl/react-data-menu.png?months=1)](https://www.npmjs.com/package/react-data-menu)