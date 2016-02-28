'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MenuPopup = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Aligner = require('./../util/Aligner.js');

var _HoverData = require('./../util/HoverData.js');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var classnames = require('classnames');

var MenuPopup = exports.MenuPopup = function (_Component) {
    _inherits(MenuPopup, _Component);

    function MenuPopup(props) {
        _classCallCheck(this, MenuPopup);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MenuPopup).call(this, props));

        _this.aligner = _this.props.aligner;
        _this.onItemClick = _this.onItemClick.bind(_this);
        _this.onPopupContextMenu = _this.onPopupContextMenu.bind(_this);
        _this.onItemMouseEnter = _this.onItemMouseEnter.bind(_this);
        _this.onItemMouseLeave = _this.onItemMouseLeave.bind(_this);
        _this.state = {
            indexMap: {},
            showing: false,
            selectedIndex: -1
        };
        return _this;
    }

    _createClass(MenuPopup, [{
        key: 'buildHoverData',
        value: function buildHoverData(data, e) {
            var popupId = this.props.popupId,
                buttonId = e.currentTarget.id,
                index = this.state.indexMap[buttonId],
                self = this;

            self.setState({
                selectedIndex: index
            });

            return new _HoverData.HoverData(popupId, buttonId, index, e.currentTarget, data);
        }
    }, {
        key: 'onPopupContextMenu',
        value: function onPopupContextMenu(e) {
            e.preventDefault();
        }
    }, {
        key: 'onItemClick',
        value: function onItemClick(data, e) {
            this.props.onItemClick(this.buildHoverData(data, e));
        }
    }, {
        key: 'onItemContextMenu',
        value: function onItemContextMenu(data, e) {
            e.preventDefault();
            this.props.onItemContextMenu(this.buildHoverData(data, e));
        }
    }, {
        key: 'onItemMouseEnter',
        value: function onItemMouseEnter(data, e) {
            this.props.onItemMouseEnter(this.buildHoverData(data, e));
        }
    }, {
        key: 'onItemMouseLeave',
        value: function onItemMouseLeave(data, e) {
            this.props.onItemMouseLeave(this.buildHoverData(data, e));
        }
    }, {
        key: 'render',
        value: function render() {
            var index = 0,
                self = this,
                popupFactory = this.props.popupFactory,
                itemFactory = this.props.itemFactory,
                indexMap = this.state.indexMap,
                key,
                children,
                menuItem,
                styles;

            children = this.props.items ? this.props.items.map(function (data) {
                key = 'menu-item-' + index;
                indexMap[key] = index;

                var classes = classnames({
                    'menu-item-selected': self.state.selectedIndex === index
                });

                data = self.expandDescriptor(data);

                // overriding standard handlers with data handlers
                var handlers = _lodash2.default.assign({
                    onClick: self.onItemClick.bind(self, data),
                    onContextMenu: self.onItemContextMenu.bind(self, data),
                    onMouseEnter: self.onItemMouseEnter.bind(self, data),
                    onMouseLeave: self.onItemMouseLeave.bind(self, data)
                }, data.handlers);

                menuItem = itemFactory.createItem(_lodash2.default.assign({}, data, { // BUG FIX "{}, "
                    id: key,
                    handlers: handlers
                }), key, classes);

                index++;

                return menuItem;
            }) : null;

            styles = {
                position: 'fixed',
                left: this.props.x + 'px',
                top: this.props.y + 'px'
            };

            var handlers = {
                onContextMenu: self.onPopupContextMenu
            };

            return popupFactory.createItem(_lodash2.default.assign({}, {
                popupId: this.props.popupId,
                styles: styles,
                children: children,
                handlers: handlers,
                showing: this.state.showing
            }));
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            // measure DOM
            if (!this.dom) {
                this.dom = _reactDom2.default.findDOMNode(this);
                this.dom.style.position = 'fixed';
            }

            // align
            this.aligner.align(this.dom, this.props.alignTo, this.props.hints, this.props.useOffset ? this.dom.firstChild : null);

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
                data.type = 'button'; // default renderer type
            }
            return data;
        }
    }]);

    return MenuPopup;
}(_react.Component);

MenuPopup.propTypes = {
    x: _react2.default.PropTypes.number,
    y: _react2.default.PropTypes.number,
    items: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.string])),
    popupId: _react2.default.PropTypes.string.isRequired,
    useOffset: _react2.default.PropTypes.bool.isRequired,
    onPopupContextMenu: _react2.default.PropTypes.func.isRequired,
    hints: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)
};
MenuPopup.defaultProps = {
    x: 0,
    y: 0,
    items: [],
    alignTo: null,
    hints: ['right', 'left', 'bottom', 'top', 'bottom'],
    useOffset: false,
    onPopupContextMenu: function onPopupContextMenu(e) {}
};