import React from 'react';
import ReactDOM from 'react-dom';
import expect, { createSpy, spyOn, isSpy } from 'expect';
import { Menu } from './../src/components/Menu';
import RectUtil from './../src/util/RectUtil';

var TestUtils = require('react-addons-test-utils');

describe('menu', function () {
    var menuPosition = {
        x: 100,
        y: 100
    },
        menu, items, callbackSpy;

    function makeMenuItems(callback) {
        return [{
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
        }];
    }

    function findDomElements() {
        var popups = document.querySelectorAll('.menu-popup'),
            items = popups[popups.length-1].querySelectorAll('.menu-item'); // last popup items

        return {
            popups: popups,
            items: items
        }
    }

    beforeEach(function() {
        callbackSpy = createSpy();
        items = makeMenuItems(callbackSpy);

        spyOn(RectUtil, 'getBoundingRect').andCall(function() {
            return {
                left: 100, right: 200, top: 100, bottom: 300, width: 100, height: 200
            }
        });

        menu = TestUtils.renderIntoDocument(
            <Menu items={items} position={menuPosition} />
        );
    });

    afterEach(function() {
        ReactDOM.unmountComponentAtNode(document.body);
        document.body.innerHTML = '';
    });

    it("renders menu", function () {
        var dom = findDomElements();
        //renderedPopups = document.querySelectorAll('.menu-popup');

        expect(dom.popups.length).toEqual(1);
    });

    it("renders menu items", function () {
        var dom = findDomElements();

        expect(dom.items.length).toEqual(4);
    });

    it("clicking an item opens the second popup", function () {
        var dom = findDomElements();

        expect(dom.popups.length).toEqual(1);

        TestUtils.Simulate.click(dom.items[2]);

        expect(callbackSpy).toHaveBeenCalled();
        expect(callbackSpy.calls.length).toEqual(1);

        dom = findDomElements();
        expect(dom.popups.length).toEqual(2);
        expect(dom.items.length).toEqual(3);
    });

    it("clicking an item in second popup opens the third popup", function () {
        var dom = findDomElements();

        expect(dom.popups.length).toEqual(1);

        TestUtils.Simulate.click(dom.items[2]);

        expect(callbackSpy).toHaveBeenCalled();
        expect(callbackSpy.calls.length).toEqual(1);

        dom = findDomElements();
        expect(dom.popups.length).toEqual(2);
        expect(dom.items.length).toEqual(3);

        TestUtils.Simulate.click(dom.items[2]);

        expect(callbackSpy.calls.length).toEqual(2);

        dom = findDomElements();
        expect(dom.popups.length).toEqual(3);
        expect(dom.items.length).toEqual(3);
    });
});