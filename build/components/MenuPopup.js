'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ITEM_ID_PREFIX = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Aligner = require('./../util/Aligner.js');

var _Aligner2 = _interopRequireDefault(_Aligner);

var _hoverData = require('./../util/hoverData.js');

var _hoverData2 = _interopRequireDefault(_hoverData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ITEM_ID_PREFIX = exports.ITEM_ID_PREFIX = 'menu-item-';

var DEFAULT_ITEM_RENDERER_TYPE = 'button';

var classnames = require('classnames');

var MenuPopup = function (_Component) {
    _inherits(MenuPopup, _Component);

    function MenuPopup(props) {
        _classCallCheck(this, MenuPopup);

        var _this = _possibleConstructorReturn(this, (MenuPopup.__proto__ || Object.getPrototypeOf(MenuPopup)).call(this, props));

        _this.aligner = _this.props.aligner;
        _this.state = {
            showing: false
        };
        return _this;
    }

    _createClass(MenuPopup, [{
        key: 'render',
        value: function render() {
            var index = 0,
                classPrefix = this.props.classPrefix,
                selectedIndex = this.props.selectedIndex,
                popupFactory = this.props.popupFactory,
                itemFactory = this.props.itemFactory,
                self = this,
                key,
                children,
                menuItem,
                styles;

            children = this.props.items ? this.props.items.map(function (data) {
                var classes = {};

                key = ITEM_ID_PREFIX + index;

                if (selectedIndex === index) {
                    classes[classPrefix + 'menu-item-selected'] = true;
                }

                data = self.expandDescriptor(data);

                menuItem = itemFactory.createItem(_lodash2.default.assign({}, data, {
                    id: key
                }), key, classnames(classes), self.props.config);

                index++;

                return menuItem;
            }) : null;

            styles = {
                position: 'fixed',
                left: this.props.x + 'px',
                top: this.props.y + 'px'
            };

            return popupFactory.createItem(_lodash2.default.assign({}, {
                popupId: this.props.popupId,
                styles: styles,
                children: children,
                showing: this.state.showing
            }));
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var classPrefix = this.props.classPrefix,
                position;

            // measure DOM
            if (!this.dom) {
                this.dom = _reactDom2.default.findDOMNode(this);
                this.dom.style.position = 'fixed';
            }

            // align
            position = this.aligner.align(this.dom, this.props.alignTo, this.props.hints, this.props.useOffset ? this.dom.firstChild : null);

            // bake some of the position information into popups' className
            if (!position.fitsX) {
                // if popup doesn't horizontally fit the screen, add this class name
                // this could be used to introduce scroll etc.
                this.dom.className += ' ' + classPrefix + 'menu-popup-overflow-x';
            }
            if (!position.fitsY) {
                // if popup doesn't vertically fit the screen, add this class name
                this.dom.className += ' ' + classPrefix + 'menu-popup-overflow-y';
            }
            if (position.direction) {
                // styling different positions ('menu-popup-align-es', 'menu-popup-align-se' etc.)
                this.dom.className += ' ' + classPrefix + 'menu-popup-align-' + position.direction;
            }

            this.setState({
                showing: true
            });
        }

        /**
         * Expands string descriptor to object descriptor
         * @param data
         * @returns {*}
         */

    }, {
        key: 'expandDescriptor',
        value: function expandDescriptor(data) {
            if (typeof data === 'string') {
                return {
                    type: data
                };
            }
            if (!data.type) {
                data.type = DEFAULT_ITEM_RENDERER_TYPE;
            }
            return data;
        }
    }]);

    return MenuPopup;
}(_react.Component);

exports.default = MenuPopup;

MenuPopup.propTypes = {
    config: _react2.default.PropTypes.object, // config object visiting every menu item
    classPrefix: _react2.default.PropTypes.string,
    x: _react2.default.PropTypes.number,
    y: _react2.default.PropTypes.number,
    items: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.string])),
    popupId: _react2.default.PropTypes.string.isRequired,
    useOffset: _react2.default.PropTypes.bool.isRequired,
    hints: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string).isRequired,
    selectedIndex: _react2.default.PropTypes.number.isRequired
};
MenuPopup.defaultProps = {
    classPrefix: '',
    x: 0,
    y: 0,
    items: [],
    alignTo: null,
    useOffset: false,
    selectedIndex: -1
};