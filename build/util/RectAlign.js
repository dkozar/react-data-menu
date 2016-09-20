'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RectAlignAnchor = exports.RectAlignSide = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RectUtil = require('./RectUtil.js');

var _RectUtil2 = _interopRequireDefault(_RectUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RectAlignSide = exports.RectAlignSide = {
    NORTH: 'n',
    SOUTH: 's',
    EAST: 'e',
    WEST: 'w'
};

var RectAlignAnchor = exports.RectAlignAnchor = {
    START: 's',
    MIDDLE: 'm',
    END: 'e'
};

var RectAlign = function () {
    function RectAlign(aligner, target) {
        _classCallCheck(this, RectAlign);

        this.aligner = aligner;
        this.target = target;
    }

    _createClass(RectAlign, [{
        key: 'getPosition',
        value: function getPosition(hints) {
            var tries = [],
                success = {
                x: -1,
                y: -1
            },
                position;

            hints.find(function (hint) {
                tries.push(hint);
                position = this.tryHint(hint);
                if (position.fitsX && success.x === -1) {
                    success.x = position.x;
                }
                if (position.fitsY && success.y === -1) {
                    success.y = position.y;
                }
                if (position.fits) {
                    return true;
                }
                return false;
            }, this);

            if (!position || !position.fits) {
                position = this.getFallbackPosition(position, success, hints);
            }
            //console.log('Final: ' + position.direction + ' (tries: ' + tries.toString() + ' of ' +  hints.toString() + ')');
            return position;
        }
    }, {
        key: 'getFallbackPosition',
        value: function getFallbackPosition(position, success, hints) {
            var aligner = this.aligner,
                target = this.target,
                preferredPosition,
                position,
                closerToLeft,
                closerToTop,
                left,
                right,
                top,
                bottom;

            // doesn't fit in any direction
            // settle closest to the first hint
            preferredPosition = this.tryHint(hints[0]);
            if (!preferredPosition.fitsX) {
                if (success.x !== -1) {
                    preferredPosition.x = success.x;
                } else {
                    left = target.body.left;
                    right = aligner.body.width - target.body.width;
                    closerToLeft = left < right;
                    preferredPosition.x = closerToLeft ? 0 : aligner.body.width - target.body.width;
                }
            }
            if (!preferredPosition.fitsY) {
                if (success.y !== -1) {
                    preferredPosition.y = success.y;
                } else {
                    top = target.body.top;
                    bottom = aligner.body.height - target.body.height;
                    closerToTop = top < bottom;
                    preferredPosition.y = closerToTop ? 0 : aligner.body.height - target.body.height;
                }
            }

            //console.log('Final: ' + position.direction + ' (tries: ' + tries.toString() + ' of ' +  hints.toString() + ')');
            return preferredPosition;
        }
    }, {
        key: 'tryHint',
        value: function tryHint(hint) {
            var aligner = this.aligner,
                target = this.target,
                offset = { x: target.body.left - target.handle.left, y: target.body.top - target.handle.top },
                side = hint[0],
                position = hint[1],
                x,
                y,
                fitsX,
                fitsY,
                fits;

            switch (side) {
                case RectAlignSide.EAST:
                    x = aligner.handle.right;
                    break;
                case RectAlignSide.WEST:
                    x = aligner.handle.left - target.body.width;
                    break;
                case RectAlignSide.NORTH:
                    y = aligner.handle.top - target.body.height;
                    break;
                case RectAlignSide.SOUTH:
                    y = aligner.handle.bottom;
                    break;
                default:
                    throw 'Unknown side: ' + side;
            }

            switch (side) {
                case RectAlignSide.EAST:
                case RectAlignSide.WEST:
                    switch (position) {
                        case RectAlignAnchor.START:
                            y = aligner.handle.top;
                            break;
                        case RectAlignAnchor.MIDDLE:
                            y = (aligner.handle.top + aligner.handle.bottom) / 2 - target.body.height / 2;
                            break;
                        case RectAlignAnchor.END:
                            y = aligner.handle.bottom - target.body.height;
                            break;
                        default:
                            throw 'Unknown position: ' + position;
                    }
                    break;
                case RectAlignSide.NORTH:
                case RectAlignSide.SOUTH:
                    switch (position) {
                        case RectAlignAnchor.START:
                            x = aligner.handle.left;
                            break;
                        case RectAlignAnchor.MIDDLE:
                            x = (aligner.handle.left + aligner.handle.right) / 2 - target.body.width / 2;
                            break;
                        case RectAlignAnchor.END:
                            x = aligner.handle.right - target.body.width;
                            break;
                        default:
                            throw 'Unknown position: ' + position;
                    }
                    break;
                default:
                    throw 'Unknown side: ' + side;
            }

            // add offset
            x += offset.x;
            y += offset.y;

            fitsX = x >= 0 && x + target.body.width <= aligner.body.width;
            fitsY = y >= 0 && y + target.body.height <= aligner.body.height;
            fits = fitsX && fitsY;

            return {
                x: x,
                y: y,
                fitsX: fitsX,
                fitsY: fitsY,
                fits: fits,
                direction: hint
            };
        }
    }]);

    return RectAlign;
}();

exports.default = RectAlign;