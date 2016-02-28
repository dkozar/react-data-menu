export default class ViewportUtil {

    static getRect() {
        var doc = document.documentElement,
            body = document.body;

        return {
            x: 0,
            y: 0,
            width: window.innerWidth || doc.clientWidth || body.clientWidth,
            height: window.innerHeight || doc.clientHeight || body.clientHeight
        };
    }
}