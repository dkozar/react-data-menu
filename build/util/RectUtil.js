"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RectUtil = function () {
    function RectUtil() {
        _classCallCheck(this, RectUtil);
    }

    _createClass(RectUtil, null, [{
        key: "getBoundingRect",
        value: function getBoundingRect(element) {
            // gets DOMRect object with six properties: left, top, right, bottom, width, height
            var bounds = element.getBoundingClientRect();

            return {
                left: bounds.left,
                right: bounds.right,
                top: bounds.top,
                bottom: bounds.bottom,
                width: bounds.width,
                height: bounds.height
            };
        }
    }, {
        key: "getZeroRectAtPosition",
        value: function getZeroRectAtPosition(position) {
            return {
                left: position.x,
                right: position.x,
                top: position.y,
                bottom: position.y,
                width: 0,
                height: 0
            };
        }
    }, {
        key: "cloneRect",
        value: function cloneRect(bounds) {
            return {
                left: bounds.left,
                right: bounds.right,
                top: bounds.top,
                bottom: bounds.bottom,
                width: bounds.width,
                height: bounds.height
            };
        }
    }, {
        key: "moveRect",
        value: function moveRect(bounds, delta) {
            return {
                left: bounds.left + delta.x,
                right: bounds.right + delta.x,
                top: bounds.top + delta.y,
                bottom: bounds.bottom + delta.y,
                width: bounds.width,
                height: bounds.height
            };
        }
    }]);

    return RectUtil;
}();

exports.default = RectUtil;