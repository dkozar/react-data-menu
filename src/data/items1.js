export const items1 = [{
    type: 'label',
    title: 'Give it a test drive:'
}, '-', {
    title: '10 levels here',
    items: [{
        title: 'One',
        items: [{
            title: 'Two',
            items: [{
                title: 'Three',
                items: [{
                    title: 'Four',
                    items: [{
                        title: 'Five',
                        items: [{
                            title: 'Six',
                            items: [{
                                title: 'Seven',
                                items: [{
                                    title: 'Eight',
                                    items: [{
                                        title: 'Nine',
                                        items: [{
                                            title: 'Ten!!!'
                                        }, '-', {
                                            title: ':-)'
                                        }]
                                    }]
                                }, '-', {
                                    title: 'Just a few clicks left...'
                                }]
                            }]
                        }, '-', {
                            title: 'Still not done...'
                        }]
                    }]
                }, '-', {
                    title: 'Doing great...'
                }]
            }]
        }, '-', {
            title: 'Keep up...'
        }]
    }, '-', {
        title: 'Dig it...'
    }]
}, {
    title: 'Simple submenu',
    items: [{
        title: 'Failure',
        callback(e) {
            console.log('*** Failure clicked', e);
        }
    }, '-', {
        title: 'Teaches',
        callback(e) {
            console.log('Menu item clicked' + e);
        }
    }, '-', {
        title: 'Success'
    }],
    callback(e) {
        console.log('*** Option 1 clicked', e);
    }
}, {
    title: 'Leaf item'
}, '-', {
    type: 'link',
    title: 'Give me the stars!',
    url: 'https://github.com/dkozar/react-data-menu/stargazers',
    target: '_blank'
}];