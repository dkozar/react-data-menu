'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HoverData = function () {
    function HoverData(popupId, itemId, popupIndex, itemIndex, element, data) {
        _classCallCheck(this, HoverData);

        this.popupId = popupId;
        this.itemId = itemId;
        this.popupIndex = popupIndex;
        this.itemIndex = itemIndex;
        this.element = element;
        this.data = data;
    }

    _createClass(HoverData, [{
        key: 'getChildItems',
        value: function getChildItems() {
            return this.data.items;
        }
    }, {
        key: 'isLeafNode',
        value: function isLeafNode() {
            return !this.data.items || this.data.items.length === 0;
        }
    }, {
        key: 'isPersistant',
        value: function isPersistant() {
            return this.data.persist;
        }
    }, {
        key: 'isExpandable',
        value: function isExpandable() {
            return this.data.items && this.data.items.length > 0;
        }
    }, {
        key: 'getElement',
        value: function getElement() {
            return this.element;
        }
    }, {
        key: 'hasCallback',
        value: function hasCallback() {
            return !!this.data.callback;
        }
    }, {
        key: 'fireCallback',
        value: function fireCallback() {
            if (!this.hasCallback) {
                throw 'HoverData: no callback defined';
            }
            return this.data.callback(arguments);
        }

        /**
         * Returns true for the same item, having the same parent
         * @param other
         * @returns {boolean}
         */

    }, {
        key: 'equals',
        value: function equals(other) {
            return !!other && this.popupId === other.popupId && this.itemId === other.itemId;
        }

        /**
         * Returns true for two different items having the same parent
         * @param other
         * @returns {boolean}
         */

    }, {
        key: 'isSiblingOf',
        value: function isSiblingOf(other) {
            return !!other && this.popupId === other.popupId && this.itemId !== other.itemId;
        }
    }, {
        key: 'isChildOf',
        value: function isChildOf(other) {
            if (!other || !other.items) {
                return false;
            }
            return _.some(other.items, function (item) {
                return item.itemId === this.itemId;
            });
        }
    }, {
        key: 'isParentTo',
        value: function isParentTo(other) {
            if (!other || !this.items) {
                return false;
            }
            return _.some(this.items, function (item) {
                return this.itemId === item.itemId;
            });
        }
    }, {
        key: 'toString',
        value: function toString() {
            return 'HoverData [popupId: ' + this.popupId + '; itemId: ' + this.itemId + '; itemIndex: ' + this.itemIndex + ']';
        }
    }]);

    return HoverData;
}();

exports.default = HoverData;