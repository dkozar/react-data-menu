import { COLORS } from './Colors';

const TOOLBAR_HEIGHT = 82;

function bringToFront(circles, circle, current) {
    circles.splice(current, 1);
    circles.push(circle);
}

function sendToBack(circles, circle, current) {
    circles.splice(current, 1);
    circles.unshift(circle);
}

function newCircle(position, circles, yOrigin) {
    var r = Math.floor(Math.random() * 150) + 50,
        color = COLORS[Math.floor(Math.random() * COLORS.length)],
        circle = {
            x: position.x, y: position.y - yOrigin, r, color
        };

    circles.push(circle);
}

function removeCircle(circles, current) {
    circles.splice(current, 1);
}

function clear(circles) {
    circles.splice(0, circles.length);
}

export default class CircleOps {

    //<editor-fold desc="Circles & commands">
    static executeCommand(command, circles, current, position) {
        var circle = circles[current],
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
                bringToFront(circles, circle, current);
                break;
            case 'send-to-back':
                sendToBack(circles, circle, current);
                break;
            case 'new-circle':
                newCircle(position, circles, TOOLBAR_HEIGHT);
                break;
            case 'remove-circle':
                removeCircle(circles, current);
                break;
            case 'clear':
                clear(circles);
                break;
        }

        if (transformed) {
            circle.x = Math.max(circle.x, 10);
            circle.y = Math.max(circle.y, 10);
            circle.r = Math.max(circle.r, 10);
        }

        return circles;
    }
}