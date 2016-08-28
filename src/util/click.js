export default class ClickUtil {

    static isGhostClick(ray) {
        return ClickUtil.isGhostClickEvent(ray.e);
    }

    static isGhostClickEvent(e) {
        return e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents;
    }
}