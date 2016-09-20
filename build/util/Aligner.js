'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RectUtil = require('.//RectUtil.js');

var _RectUtil2 = _interopRequireDefault(_RectUtil);

var _RectAlign = require('./RectAlign.js');

var _RectAlign2 = _interopRequireDefault(_RectAlign);

var _ViewportUtil = require('./ViewportUtil.js');

var _ViewportUtil2 = _interopRequireDefault(_ViewportUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Aligner = function () {
    function Aligner() {
        _classCallCheck(this, Aligner);
    }

    _createClass(Aligner, [{
        key: 'align',
        value: function align(target, alignTo, hints, handle) {
            var offset = {
                x: 0,
                y: 0
            },
                targetRect,
                alignToRect,
                viewportRect,
                targetHandle,
                position;

            if (alignTo) {
                if (alignTo.x && alignTo.y) {
                    alignToRect = _RectUtil2.default.getZeroRectAtPosition(alignTo);
                } else {
                    alignToRect = _RectUtil2.default.getBoundingRect(alignTo);
                }

                targetRect = _RectUtil2.default.getBoundingRect(target), viewportRect = _ViewportUtil2.default.getRect();

                targetHandle = handle ? _RectUtil2.default.getBoundingRect(handle) : _RectUtil2.default.cloneRect(targetRect);

                var rectAlign = new _RectAlign2.default({
                    body: viewportRect,
                    handle: alignToRect
                }, {
                    body: targetRect,
                    handle: targetHandle
                });

                position = rectAlign.getPosition(hints);

                target.style.left = position.x + offset.x + 'px';
                target.style.top = position.y + offset.y + 'px';
            }

            return position;
        }
    }]);

    return Aligner;
}();

exports.default = Aligner;