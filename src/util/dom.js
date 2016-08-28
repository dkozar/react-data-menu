export default class Dom {
    /**
     * Returns true if parent element contains child, or parent is child
     * @param parentElement
     * @param childElement
     * @returns {boolean}
     */
    static contains(parentElement, childElement) {
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
    static buildClassNames(classPrefix, classNames) {
        var len = classNames.length,
            obj = {},
            className,
            i;

        for (i = 0; i < len; i ++) {
            className = classNames[i];
            obj[classPrefix + className] = !!className; // only if className defined
        }

        return obj;
    }
}