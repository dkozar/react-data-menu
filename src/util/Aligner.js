import RectUtil from './/RectUtil.js';
import RectAlign from './RectAlign.js';
import ViewportUtil from './ViewportUtil.js';

export default class Aligner {

    align(target, alignTo, hints, handle) {
        var offset = {
                x: 0,
                y: 0
            },
            targetRect,
            alignToRect,
            viewportRect,
            targetHandle,
            position;

        if (alignTo) {
            if (alignTo.x && alignTo.y) {
                alignToRect = RectUtil.getZeroRectAtPosition(alignTo);
            } else {
                alignToRect = RectUtil.getBoundingRect(alignTo);
            }

            targetRect = RectUtil.getBoundingRect(target),
            viewportRect = ViewportUtil.getRect();

            targetHandle = handle ?
                RectUtil.getBoundingRect(handle) :
                RectUtil.cloneRect(targetRect);

            var rectAlign = new RectAlign({
                body: viewportRect,
                handle: alignToRect
            }, {
                body: targetRect,
                handle: targetHandle
            });

            position = rectAlign.getPosition(hints);

            target.style.left = (position.x + offset.x) + 'px';
            target.style.top = (position.y + offset.y) + 'px';
        }

        return position;
    }
}