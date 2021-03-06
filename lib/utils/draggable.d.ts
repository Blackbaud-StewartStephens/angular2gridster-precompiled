import { Observable } from 'rxjs';
import { DraggableEvent } from './DraggableEvent';
export declare class Draggable {
    static SCROLL_SPEED: number;
    element: Element;
    dragStart: Observable<DraggableEvent>;
    dragMove: Observable<DraggableEvent>;
    dragStop: Observable<DraggableEvent>;
    private requestAnimationFrame;
    private cancelAnimationFrame;
    private mousemove;
    private mouseup;
    private mousedown;
    private config;
    private autoScrollingInterval;
    constructor(element: Element, config?: {});
    private createDragStartObservable();
    private createDragMoveObservable(dragStart);
    private createDragStopObservable(dragStart);
    private startScroll(item, event);
    private startScrollForContainer(event, scrollContainer);
    private startScrollVerticallyForContainer(event, scrollContainer);
    private startScrollHorizontallyForContainer(event, scrollContainer);
    private startScrollForWindow(event);
    private startScrollVerticallyForWindow(event);
    private startScrollHorizontallyForWindow(event);
    private getScrollContainer(node);
    private startAutoScrolling(node, amount, direction);
    private getOffset(el);
    private getScroll(scrollProp, offsetProp);
    private isDragingByHandler(event);
    private isValidDragHandler(targetEl);
    private inRange(startEvent, moveEvent, range);
    private hasElementWithClass(className, target);
    pauseEvent(e: Event): void;
    private fixProblemWithDnDForIE(element);
    private removeTouchActionNone(element);
    private addTouchActionNone(element);
    private isTouchDevice();
    private isIEorEdge();
}
