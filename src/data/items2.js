export const items2 = [{
    title: 'Item 1-1'
}, '-', {
    title: 'Item 1-2',
    items: [{
        title: 'Item 2-1',
        callback(e) {
            console.log('*** Item 2-1 clicked', e);
        }
    }, {
        title: 'Item 2-2',
        callback(e) {
            console.log('*** Item 2-2 clicked', e);
        }
    }, {
        title: 'Item 2-3',
        items: [{
            title: 'Item 3-1',
            callback(e) {
                console.log('*** Item 3-1 clicked', e);
            }
        }, {
            title: 'Item 3-2',
            callback(e) {
                console.log('*** Item 3-2 clicked', e);
            }
        }, '-', {
            type: 'label',
            title: 'Last item:',
            callback(e) {
                console.log('*** Item 2-1 clicked', e);
            }
        }, {
            title: 'Item 3-3',
            callback(e) {
                console.log('*** Item 3-3 clicked', e);
            }
        }]
    }]
}, {
    title: 'Item 1-3'
}];