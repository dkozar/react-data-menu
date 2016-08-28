'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _hoverData = require('./hoverData');

var _hoverData2 = _interopRequireDefault(_hoverData);

var _MenuPopup = require('./../components/MenuPopup');

var _Menu = require('./../components/Menu');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HoverDataBuilder = function () {
    function HoverDataBuilder() {
        _classCallCheck(this, HoverDataBuilder);
    }

    _createClass(HoverDataBuilder, null, [{
        key: 'build',
        value: function build(popups, ray) {
            var data = {},
                popupElement = ray.intersectsId(_Menu.POPUP_ID_PREFIX),
                itemElement = ray.intersectsId(_MenuPopup.ITEM_ID_PREFIX),
                hoverData,
                popupId,
                popupIndex,
                itemId,
                itemIndex;

            if (popupElement && itemElement) {
                popupId = popupElement.id;
                popupIndex = parseInt(popupId.split(_Menu.POPUP_ID_PREFIX)[1]);
                itemId = itemElement.id;
                itemIndex = parseInt(itemId.split(_MenuPopup.ITEM_ID_PREFIX)[1]);
                data = popups[popupIndex].items[itemIndex];
                hoverData = new _hoverData2.default(popupId, itemId, popupIndex, itemIndex, itemElement, data);
            }

            return hoverData;
        }
    }]);

    return HoverDataBuilder;
}();

exports.default = HoverDataBuilder;