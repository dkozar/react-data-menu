'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DefaultRenderers = undefined;

var _ButtonRenderer = require('./ButtonRenderer.js');

var _LabelRenderer = require('./LabelRenderer.js');

var _SeparatorRenderer = require('./SeparatorRenderer.js');

var DefaultRenderers = exports.DefaultRenderers = {
    'button': _ButtonRenderer.Button,
    'label': _LabelRenderer.Label,
    '-': _SeparatorRenderer.Separator
};