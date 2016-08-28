import _ from 'lodash';
import HoverData from './hoverData';
import { ITEM_ID_PREFIX } from './../components/MenuPopup';
import { POPUP_ID_PREFIX } from './../components/Menu';

export default class HoverDataBuilder {

    static build(popups, ray) {
        var data = {},
            popupElement = ray.intersectsId(POPUP_ID_PREFIX),
            itemElement = ray.intersectsId(ITEM_ID_PREFIX),
            hoverData, popupId, popupIndex, itemId, itemIndex;

        if (popupElement && itemElement) {
            popupId = popupElement.id;
            popupIndex = parseInt(popupId.split(POPUP_ID_PREFIX)[1]);
            itemId = itemElement.id;
            itemIndex = parseInt(itemId.split(ITEM_ID_PREFIX)[1]);
            data = popups[popupIndex].items[itemIndex];
            hoverData = new HoverData(popupId, itemId, popupIndex, itemIndex, itemElement, data);
        }

        return hoverData;
    }
}