'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MenuItemFactory = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var classnames = require('classnames');

var MenuItemFactory = exports.MenuItemFactory = function () {
    function MenuItemFactory(renderers, classPrefix) {
        _classCallCheck(this, MenuItemFactory);

        this.renderers = renderers;
        this.classPrefix = classPrefix;
    }

    _createClass(MenuItemFactory, [{
        key: 'createItem',
        value: function createItem(data, key, classes) {
            var isExpandable = !!data.items,
                renderer = this.renderers[data.type],
                additions = {},
                classPrefix = this.classPrefix,
                className;

            additions[this.classPrefix + 'menu-item'] = true;
            additions[this.classPrefix + 'menu-item-expandable'] = isExpandable;
            className = classnames(classes, additions);

            if (!renderer) {
                throw 'Undefined renderer for type [' + data.type + ']';
            }

            return _react2.default.createElement(renderer, {
                data: data,
                key: key,
                isExpandable: isExpandable,
                className: className,
                classPrefix: classPrefix
            });
        }
    }]);

    return MenuItemFactory;
}();