import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DropdownMenu } from './components/DropdownMenu.js';
import { Svg } from './components/Svg.js';
import { TextRotator } from './components/TextRotator.js';
import { AppMenuItems } from './data/AppMenuItems.js';
import { Circle } from './components/Circle.js';
import { CircleMenuItems } from './data/CircleMenuItems.js';
import { Menu } from './components/Menu.js';
import { items1 } from './data/items1.js';
import { items2 } from './data/items2.js';
import { LinkRenderer } from './renderers/LinkRenderer.js';
import MenuEventDispatcher from './util/MenuEventDispatcher.js';

require('./styles/main.css');
require('./styles/menu.css');

const TOOLBAR_HEIGHT = 82,
    PURPLE = '#5943aa',
    ORANGE = '#ff7c35',
    GREEN = '#2ead6d',
    RED = '#e31d65',
    YELLOW = '#ffcc00',
    COLORS = [PURPLE, ORANGE, GREEN, RED, YELLOW];

export class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showMenu: false,
            openOnMouseOver: false,
            circles: [
                {
                    x: 200, y: 200, r: 100, color: PURPLE
                },
                {
                    x: 800, y: 500, r: 150, color: ORANGE
                }
            ],
            current: -1
        };

        this.onCircleMenu = this.onCircleMenu.bind(this);
        this.onAppMenu = this.onAppMenu.bind(this);
        this.onMenuClose = this.onMenuClose.bind(this);
        this.executeCommand = this.executeCommand.bind(this);
        this.onAnywhereClickOrContextMenu = this.onAnywhereClickOrContextMenu.bind(this);

        MenuEventDispatcher.getInstance().connect({
            onAnywhereClick: this.onAnywhereClickOrContextMenu,
            onAnywhereContextMenu: this.onAnywhereClickOrContextMenu
        });
    }

    onAnywhereClickOrContextMenu(e) {
        this.setState({
            openOnMouseOver: false
        });
    }

    //<editor-fold desc="Show/hide menu">
    showMenu(e, items) {
        this.menuPosition = {
            x: e.clientX,
            y: e.clientY
        };
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            showMenu: true,
            items
        });
    }

    onAppMenu(e) {
        this.showMenu(e, this.appMenuItems);
    }

    onCircleMenu(source, e) {
        this.state.current = source;
        this.showMenu(e, this.circleMenuItems);
    }

    onMenuClose() {
        this.setState({
            showMenu: false,
            current: -1
        });
    }
    //</editor-fold>

    //<editor-fold desc="Commands">
    executeCommand(command) {
        var circles = this.state.circles,
            current = this.state.current,
            circle = circles[current],
            transformed = false;

        switch (command) {
            case 'increase-x':
                circle.x += 10;
                transformed = true;
                break;
            case 'decrease-x':
                circle.x -= 10;
                transformed = true;
                break;
            case 'increase-y':
                circle.y += 10;
                transformed = true;
                break;
            case 'decrease-y':
                circle.y -= 10;
                transformed = true;
                break;
            case 'increase-r':
                circle.r += 10;
                transformed = true;
                break;
            case 'decrease-r':
                circle.r -= 10;
                transformed = true;
                break;
            case 'bring-to-front':
                this.bringToTop(circles, circle, current);
                break;
            case 'send-to-back':
                this.sendToBack(circles, circle, current);
                break;
            case 'new-circle':
                this.newCircle(circles);
                break;
            case 'remove-circle':
                this.removeCircle(circles, current);
                break;
            case 'clear':
                this.clear(circles);
                break;
        }

        if (transformed) {
            circle.x = Math.max(circle.x, 10);
            circle.y = Math.max(circle.y, 10);
            circle.r = Math.max(circle.r, 10);
        }

        this.setState({circles});
    }

    bringToTop(circles, circle, current) {
        circles.splice(current, 1);
        circles.push(circle);
    }

    sendToBack(circles, circle, current) {
        circles.splice(current, 1);
        circles.unshift(circle);
    }

    newCircle(circles) {
        var pos = this.menuPosition,
            r = Math.floor(Math.random() * 150) + 50,
            color = COLORS[Math.floor(Math.random() * COLORS.length)],
            circle = {
                x: pos.x, y: pos.y - TOOLBAR_HEIGHT, r, color
            };

        circles.push(circle);
    }

    removeCircle(circles, current) {
        circles.splice(current, 1);
    }

    clear(circles) {
        circles.splice(0, circles.length);
    }
    //</editor-fold>

    componentDidMount() {
        var self = this;

        function binder() {
            return self.executeCommand.bind(self, ...arguments);
        }
        this.circleMenuItems = new CircleMenuItems(binder);
        this.appMenuItems = new AppMenuItems(binder);
    }

    render() {
        var self = this,
            index = 0,
            menu = this.state.showMenu ? (
                <Menu items={this.state.items} position={this.menuPosition} onClose={this.onMenuClose} />
            ) : null,
            circles = this.state.circles.map(function (circle) {
                return (
                    <Circle {...circle} key={'circle-' + index} strokeColor='white'
                                        selected={self.state.current === index}
                                        onContextMenu={self.onCircleMenu.bind(this, index++)}
                                        onMenuClose={self.onMenuClose} />
                );
            }),
            renderers = {
                'link': LinkRenderer
            },
            common = {
                openOnMouseOver: this.state.openOnMouseOver,
                renderers,
                onOpen() {
                    self.setState({
                        openOnMouseOver: true // let's have the Mac-like behaviour. Once the first dropdown is open by clicking, consequent open on mouse-over.
                    });
                }
            };

        return (
            <div onContextMenu={this.onAppMenu} >
                <div className='toolbar'>
                    <DropdownMenu buttonText='React Data Menu' items={items1} {...common} />
                    <DropdownMenu buttonText='Example' items={items2} {...common} />
                </div>

                <div className='container'>
                    <Svg width='100%' height='100%'>
                        {circles}
                    </Svg>
                </div>

                {menu}

                <div className='toolbar toolbar-bottom'>
                    <DropdownMenu items={items1} {...common} >
                        <button ref='button' className='menu-button'>
                            Nice menu?
                        </button>
                    </DropdownMenu>
                    <TextRotator />
                </div>
            </div>
        );
    }
}