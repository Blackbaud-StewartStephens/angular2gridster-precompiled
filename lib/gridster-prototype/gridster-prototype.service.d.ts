import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GridsterService } from '../gridster.service';
import { GridsterItemPrototypeDirective } from './gridster-item-prototype.directive';
import { DraggableEvent } from '../utils/DraggableEvent';
@Injectable()
export declare class GridsterPrototypeService {
    private isDragging;
    private dragSubject;
    private dragStartSubject;
    private dragStopSubject;
    constructor();
    observeDropOver(gridster: GridsterService): Observable<any>;
    observeDropOut(gridster: GridsterService): Observable<any>;
    observeDragOver(gridster: GridsterService): {
        dragOver: Observable<GridsterItemPrototypeDirective>;
        dragEnter: Observable<GridsterItemPrototypeDirective>;
        dragOut: Observable<GridsterItemPrototypeDirective>;
    };
    dragItemStart(item: GridsterItemPrototypeDirective, event: DraggableEvent): void;
    dragItemStop(item: GridsterItemPrototypeDirective, event: DraggableEvent): void;
    updatePrototypePosition(item: GridsterItemPrototypeDirective, event: DraggableEvent): void;
    /**
     * Creates observable that is fired on dragging over gridster container.
     */
    createDragOverObservable(dragIsOver: Observable<{
        item: GridsterItemPrototypeDirective;
        isOver: boolean;
    }>, gridster: GridsterService): Observable<GridsterItemPrototypeDirective>;
    /**
     * Creates observable that is fired on drag enter gridster container.
     */
    private createDragEnterObservable(dragIsOver, gridster);
    /**
     * Creates observable that is fired on drag out gridster container.
     */
    private createDragOutObservable(dragIsOver, gridster);
    /**
     * Checks whether "element" position fits inside "containerEl" position.
     * It checks if "element" is totally covered by "containerEl" area.
     */
    private isOverGridster(item, gridsterEl, event, options);
}
