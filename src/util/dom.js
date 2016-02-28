export class Dom {
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
        var node = childElement.parentNode;
        while (node != null) {
            if (node == parentElement) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
}