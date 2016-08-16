'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function buildPath(parentElement, childElement) {
    var path = [],
        node;

    path.push(childElement);

    if (childElement === parentElement) {
        return path;
    }

    node = childElement.parentNode;

    while (node != null) {
        path.push(node);
        if (node === parentElement) {
            return path;
        }
        node = node.parentNode;
    }
    return null; // not a real path
}

var DomRoute = exports.DomRoute = function () {

    /**
     * @param childNode
     * @param parentNode Optional
     */

    function DomRoute(childNode, parentNode) {
        _classCallCheck(this, DomRoute);

        this.childNode = childNode;
        this.parentNode = parentNode || document;
    }

    /**
     * Gets the reversed (bottom-up) path
     * @returns {*} Array of DOM nodes
     */


    _createClass(DomRoute, [{
        key: 'getPathReversed',
        value: function getPathReversed() {
            if (!this.pathReversed) {
                this.pathReversed = buildPath(this.parentNode, this.childNode);
            }
            return this.pathReversed;
        }

        /**
         * Gets the top-down path
         * @returns {*} Array of DOM nodes
         */

    }, {
        key: 'getPath',
        value: function getPath() {
            var reversed = this.getPathReversed(),
                len = reversed.length,
                i;

            if (!this.path) {
                this.path = [];
                for (i = len - 1; i >= 0; i--) {
                    this.path.push(reversed[i]);
                }
            }
            return this.path;
        }

        /**
         * Returns true if this route contains DOM node
         * @param node
         * @returns {boolean}
         */

    }, {
        key: 'contains',
        value: function contains(node) {
            return this.getPathReversed().indexOf(node) > -1;
        }
    }, {
        key: 'getTarget',
        value: function getTarget() {
            return this.childNode;
        }
    }, {
        key: 'toString',
        value: function toString() {
            return 'DomRoute(' + this.getPath().length + ' elements)';
        }
    }]);

    return DomRoute;
}();