"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewportUtil = function () {
    function ViewportUtil() {
        _classCallCheck(this, ViewportUtil);
    }

    _createClass(ViewportUtil, null, [{
        key: "getRect",
        value: function getRect() {
            var doc = document.documentElement,
                body = document.body;

            return {
                x: 0,
                y: 0,
                width: window.innerWidth || doc.clientWidth || body.clientWidth,
                height: window.innerHeight || doc.clientHeight || body.clientHeight
            };
        }
    }]);

    return ViewportUtil;
}();

exports.default = ViewportUtil;