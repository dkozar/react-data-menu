export default class AppMenuItems {
    constructor(binder) {
        return [{
            type: 'label',
            title: 'Application menu:'
        }, '-', {
            title: 'New circle',
            callback: binder('new-circle')
        }, {
            title: 'Clear',
            callback: binder('clear')
        }];
    }
}