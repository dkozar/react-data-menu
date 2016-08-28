'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CircleMenuItems = function CircleMenuItems(binder) {
    _classCallCheck(this, CircleMenuItems);

    return [{
        type: 'label',
        title: 'Circle options:'
    }, '-', {
        title: 'Position',
        items: [{
            title: 'X coordinate',
            items: [{
                title: 'Move left',
                persist: true,
                callback: binder('decrease-x')
            }, {
                title: 'Move right',
                persist: true,
                callback: binder('increase-x')
            }]
        }, {
            title: 'Y coordinate',
            items: [{
                title: 'Move up',
                persist: true,
                callback: binder('decrease-y')
            }, {
                title: 'Move down',
                persist: true,
                callback: binder('increase-y')
            }]
        }]
    }, {
        title: 'Radius',
        items: [{
            title: 'Increase',
            persist: true,
            callback: binder('increase-r')
        }, {
            title: 'Decrease',
            persist: true,
            callback: binder('decrease-r')
        }]
    }, '-', {
        title: 'Bring to front',
        callback: binder('bring-to-front')
    }, {
        title: 'Send to back',
        callback: binder('send-to-back')
    }, '-', {
        title: 'Remove',
        callback: binder('remove-circle')
    }];
};

exports.default = CircleMenuItems;