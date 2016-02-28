export default class RectUtil {

    static getBoundingRect(element) {
        // gets DOMRect object with six properties: left, top, right, bottom, width, height
        var bounds = element.getBoundingClientRect();

        return {
            left: bounds.left,
            right: bounds.right,
            top: bounds.top,
            bottom: bounds.bottom,
            width: bounds.width,
            height: bounds.height
        }
    }

    static getZeroRectAtPosition(position) {
        return {
            left: position.x,
            right: position.x,
            top: position.y,
            bottom: position.y,
            width: 0,
            height: 0
        }
    }

    static cloneRect(bounds) {
        return {
            left: bounds.left,
            right: bounds.right,
            top: bounds.top,
            bottom: bounds.bottom,
            width: bounds.width,
            height: bounds.height
        }
    }

    static moveRect(bounds, delta) {
        return {
            left: bounds.left + delta.x,
            right: bounds.right + delta.x,
            top: bounds.top + delta.y,
            bottom: bounds.bottom + delta.y,
            width: bounds.width,
            height: bounds.height
        }
    }
}