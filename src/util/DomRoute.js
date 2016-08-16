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

export class DomRoute {

    /**
     * @param childNode
     * @param parentNode Optional
     */
    constructor(childNode, parentNode) {
        this.childNode = childNode;
        this.parentNode = parentNode || document;
    }

    /**
     * Gets the reversed (bottom-up) path
     * @returns {*} Array of DOM nodes
     */
    getPathReversed() {
        if (!this.pathReversed) {
            this.pathReversed = buildPath(this.parentNode, this.childNode);
        }
        return this.pathReversed;
    }

    /**
     * Gets the top-down path
     * @returns {*} Array of DOM nodes
     */
    getPath() {
        var reversed = this.getPathReversed(),
            len = reversed.length,
            i;

        if (!this.path) {
            this.path = [];
            for (i = len - 1; i >= 0; i --) {
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
    contains(node) {
        return this.getPathReversed().indexOf(node) > -1;
    }

    getTarget() {
        return this.childNode;
    }

    toString() {
        return 'DomRoute(' + this.getPath().length + ' elements)';
    }
}