'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppMenuItems = function AppMenuItems(binder) {
    _classCallCheck(this, AppMenuItems);

    return [{
        type: 'label',
        title: 'Application menu:'
    }, '-', {
        title: 'New circle',
        callback: binder('new-circle')
    }, {
        title: 'Clear',
        callback: binder('clear')
    }];
};

exports.default = AppMenuItems;