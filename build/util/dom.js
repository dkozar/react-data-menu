"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dom = function () {
    function Dom() {
        _classCallCheck(this, Dom);
    }

    _createClass(Dom, null, [{
        key: "contains",

        /**
         * Returns true if parent element contains child, or parent is child
         * @param parentElement
         * @param childElement
         * @returns {boolean}
         */
        value: function contains(parentElement, childElement) {
            if (childElement == parentElement) {
                return true;
            }
            var node = childElement.root;
            while (node != null) {
                if (node == parentElement) {
                    return true;
                }
                node = node.root;
            }
            return false;
        }

        /**
         * @param classPrefix string
         * @param classNames Array of strings
         * @returns {{}} Map of class names
         */

    }, {
        key: "buildClassNames",
        value: function buildClassNames(classPrefix, classNames) {
            var len = classNames.length,
                obj = {},
                className,
                i;

            for (i = 0; i < len; i++) {
                className = classNames[i];
                obj[classPrefix + className] = !!className; // only if className defined
            }

            return obj;
        }
    }]);

    return Dom;
}();

exports.default = Dom;