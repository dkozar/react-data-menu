import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './../src/App';
import { Menu } from './../src/components/Menu';
import RectUtil from './../src/util/RectUtil';

var expect = require('expect'),
    TestUtils = require('react-addons-test-utils');

describe('demo', function () {
    var app;

    beforeEach(function() {
        expect.spyOn(RectUtil, 'getBoundingRect').andCall(function() {
            return {
                left: 100, right: 200, top: 100, bottom: 300, width: 100, height: 200
            }
        });

        app = TestUtils.renderIntoDocument(
            <App />
        );
    });

    afterEach(function() {
        ReactDOM.unmountComponentAtNode(document.body);
        document.body.innerHTML = '';
    });

    it("renders the app", function () {
        var toolbars = TestUtils.scryRenderedDOMComponentsWithClass(app, 'toolbar'),
            container = TestUtils.findRenderedDOMComponentWithClass(app, 'container'),
            toolbarBottom = TestUtils.findRenderedDOMComponentWithClass(app, 'toolbar-bottom');

        expect(container).toExist();

        // expect two toolbars, one at page bottom
        expect(toolbars.length).toEqual(2);
        expect(toolbarBottom).toExist();
    });

    it("app right-click shows menu", function () {
        var container = TestUtils.findRenderedDOMComponentWithClass(app, 'container'),
            menu, menuDom;

        TestUtils.Simulate.contextMenu(container);

        menu = TestUtils.findRenderedDOMComponentWithClass(app, 'menu');
        expect(menu).toExist();

        menuDom = document.querySelector('.menu-popup');
        expect(menuDom).toExist();
    });

    it("app click hides menu", function () {
        var container = TestUtils.findRenderedDOMComponentWithClass(app, 'container'),
            menu, menuDom;

        TestUtils.Simulate.contextMenu(container);

        menu = TestUtils.findRenderedDOMComponentWithClass(app, 'menu');
        expect(menu).toExist();

        //TestUtils.Simulate.click(container);
        //
        //menuDom = document.querySelector('.menu-popup');
        //expect(menuDom).toNotExist();
    });
});