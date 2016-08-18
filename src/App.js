import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Dom } from './util/Dom';
import { DomRoute } from './util/DomRoute';
import { DropdownMenu } from './components/DropdownMenu.js';
import { Svg } from './components/Svg.js';
import { TextRotator } from './components/TextRotator.js';
import { AppMenuItems } from './data/AppMenuItems.js';
import { Circle } from './components/Circle.js';
import { CircleMenuItems } from './data/CircleMenuItems.js';
import { Menu } from './components/Menu.js';
import { items1 } from './data/items1.js';
import { items2 } from './data/items2.js';
import { helpItems } from './data/helpItems.js';
import { LinkRenderer } from './renderers/LinkRenderer.js';
import { HelpRenderer } from './renderers/HelpRenderer.js';
import MenuEventDispatcher from './util/MenuEventDispatcher.js';

require('./styles/main.css');
require('./styles/menu.css');

const TOOLBAR_HEIGHT = 82,
    PURPLE = '#5943aa',
    ORANGE = '#ff7c35',
    RED = '#e31d65',
    YELLOW = '#ffcc00',
    COLORS = [PURPLE, ORANGE, RED, YELLOW];

var canvasElement;

//<editor-fold desc="Helper functions">
function isCanvasElement(route) {
    return route.contains(canvasElement);
}

function isCircle(target) {
    return isCanvasElement && target.id.startsWith('circle');
}
//</editor-fold>

export class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            contextMenuVisible: false,
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

        this.onMenuClose = this.onMenuClose.bind(this);
        this.onClickOutside = this.onClickOutside.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.executeCommand = this.executeCommand.bind(this);

        // subscribing to menu event dispatcher
        MenuEventDispatcher.getInstance().connect({
            onClickOutside: this.onClickOutside,
            onContextMenu: this.onContextMenu
        });
    }

    //<editor-fold desc="Handlers">
    /**
     * Fires when clicked outside of the current menu
     */
    onClickOutside() {
        this.setState({
            openOnMouseOver: false
        });
    }

    /**
     * Fires on contextmenu or tap-and-hold
     * @param e
     * @param position
     * @param route DomRoute
     */
    onContextMenu(e, position, route) {
        //var target = route.getTarget();
        var target = e.target;

        this.setState({
            openOnMouseOver: false
        });

        if (!isCanvasElement(route)) {
            return; // we're interested only in canvas clicks
        }
        if (isCircle(target)) {
            // circle clicked
            this.selectCircle(target);
            this.showContextMenu(e, position, this.circleMenuItems);
        } else {
            // background clicked
            this.setState({
                current: -1
            });
            this.showContextMenu(e, position, this.appMenuItems);
        }
    }

    /**
     * Fires on menu close
     * We would accomplish the same effect by subscribing to dispatched directly, instead of the Menu
     */
    onMenuClose() {
        this.setState({
            contextMenuVisible: false,
            current: -1
        });
    }
    //</editor-fold>

    //<editor-fold desc="Show/hide menu">
    showContextMenu(e, position, items) {
        var self = this;

        e.preventDefault();
        e.stopPropagation();

        self.setState({
            contextMenuVisible: true,
            menuPosition: position,
            items
        });
    }
    //</editor-fold>

    //<editor-fold desc="Circles & commands">
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

    selectCircle(circleElement) {
        var circleIndex = parseInt(circleElement.id.split('-')[1]);

        this.state.current = circleIndex;
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
        var pos = this.state.menuPosition,
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

    render() {
        var self = this,
            index = 0,
            menu = this.state.contextMenuVisible ? (
                <Menu items={this.state.items}
                      position={this.state.menuPosition}
                      onClose={this.onMenuClose} />
            ) : null,
            circles = this.state.circles.map(function (circle) {
                var circle = (
                    <Circle {...circle} id={'circle-' + index} key={'circle-' + index} strokeColor='white'
                        selected={self.state.current === index} />
                );

                index++;
                return circle;
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
            <div>
                <div className='toolbar'>
                    <DropdownMenu buttonText='React Data Menu' items={items1} {...common} />
                    <DropdownMenu buttonText='Menu 1' items={items2} {...common} />
                    <DropdownMenu buttonText='Menu 2' items={items2} {...common} />
                    <DropdownMenu buttonText='Menu 3' items={items2} {...common} />
                </div>

                <div ref='canvas' className='container'>
                    <Svg width='100%' height='100%'>
                        {circles}
                    </Svg>
                    <TextRotator />
                </div>

                {menu}

                { /* Bottom toolbar - let's not toggle these buttons */ }
                <div className='toolbar toolbar-bottom'>
                    { /* Custom button example */ }
                    <DropdownMenu items={items1} {...common} toggleMode={false}>
                        <button className='menu-button'>Menu 4</button>
                    </DropdownMenu>
                    <DropdownMenu buttonText='Menu 5' items={items2} {...common} toggleMode={false} />
                    <DropdownMenu buttonText='Menu 6' items={items2} {...common} toggleMode={false} />
                    { /* Tooltip example (single item menu) */ }
                    <DropdownMenu
                        items={helpItems}
                        className='about'
                        classPrefix='help-'
                        toggleMode={false}
                        openOnMouseOver={true}
                        closeOnMouseOut={false}
                        mouseEnterDelay={500}
                        mouseLeaveDelay={2000}
                        hints={function() {
                            return ['ne'];
                        }}
                        renderers={{
                            'help': HelpRenderer
                        }}>
                        <button className='menu-button'>?</button>
                    </DropdownMenu>
                </div>
            </div>
        );
    }

    componentDidMount() {
        var self = this;

        function binder() {
            return self.executeCommand.bind(self, ...arguments);
        }
        this.circleMenuItems = new CircleMenuItems(binder);
        this.appMenuItems = new AppMenuItems(binder);

        canvasElement = ReactDOM.findDOMNode(this.refs.canvas);
    }
}