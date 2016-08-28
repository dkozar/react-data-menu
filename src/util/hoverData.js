export default class HoverData {
    constructor(popupId, itemId, popupIndex, itemIndex, element, data) {
        this.popupId = popupId;
        this.itemId = itemId;
        this.popupIndex = popupIndex;
        this.itemIndex = itemIndex;
        this.element = element;
        this.data = data;
    }

    getChildItems() {
        return this.data.items;
    }

    isLeafNode() {
        return !this.data.items || this.data.items.length === 0;
    }

    isPersistant() {
        return this.data.persist;
    }

    isExpandable() {
        return this.data.items && this.data.items.length > 0;
    }

    getElement() {
        return this.element;
    }

    hasCallback() {
        return !!this.data.callback;
    }

    fireCallback() {
        if (!this.hasCallback) {
            throw 'HoverData: no callback defined';
        }
        return this.data.callback(arguments);
    }

    /**
     * Returns true for the same item, having the same parent
     * @param other
     * @returns {boolean}
     */
    equals(other) {
        return !!other && this.popupId === other.popupId && this.itemId === other.itemId;
    }

    /**
     * Returns true for two different items having the same parent
     * @param other
     * @returns {boolean}
     */
    isSiblingOf(other) {
        return !!other && this.popupId === other.popupId && this.itemId !== other.itemId;
    }

    isChildOf(other) {
        if (!other || !other.items) {
            return false;
        }
        return _.some(other.items, function(item) {
            return item.itemId === this.itemId;
        });
    }

    isParentTo(other) {
        if (!other || !this.items) {
            return false;
        }
        return _.some(this.items, function(item) {
            return this.itemId === item.itemId;
        });
    }

    toString() {
        return 'HoverData [popupId: ' + this.popupId + '; itemId: ' + this.itemId + '; itemIndex: ' + this.itemIndex + ']';
    }
}