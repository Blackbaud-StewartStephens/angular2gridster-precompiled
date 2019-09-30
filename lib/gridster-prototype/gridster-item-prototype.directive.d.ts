import { ElementRef, EventEmitter, OnInit, OnDestroy, NgZone, Directive, Output, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GridsterPrototypeService } from './gridster-prototype.service';
import { GridListItem } from '../gridList/GridListItem';
import { GridsterService } from '../gridster.service';
@Directive({
    selector: '[ngxGridsterItemPrototype]'
})
export declare class GridsterItemPrototypeDirective implements OnInit, OnDestroy {
    private zone;
    private elementRef;
    private gridsterPrototype;
    @Output() drop: EventEmitter<{}>;
    @Output() start: EventEmitter<{}>;
    @Output() cancel: EventEmitter<{}>;
    @Output() enter: EventEmitter<{}>;
    @Output() out: EventEmitter<{}>;
    @Input() data: any;
    @Input() config: any;
    x: number;
    y: number;
    @Input() w: number;
    @Input() wSm: number;
    @Input() wMd: number;
    @Input() wLg: number;
    @Input() wXl: number;
    @Input() h: number;
    @Input() hSm: number;
    @Input() hMd: number;
    @Input() hLg: number;
    @Input() hXl: number;
    @Input() variableHeight: boolean;
    @Input() variableHeightContainToRow: boolean;
    positionX: number;
    positionY: number;
    autoSize: boolean;
    $element: HTMLElement;
    /**
     * Mouse drag observable
     */
    drag: Observable<any>;
    /**
     * Subscribtion for drag observable
     */
    dragSubscription: Subscription;
    isDragging: boolean;
    item: GridListItem;
    containerRectange: ClientRect;
    private dragContextGridster;
    private parentRect;
    private parentOffset;
    private subscribtions;
    readonly dragAndDrop: boolean;
    readonly gridster: GridsterService;
    constructor(zone: NgZone, elementRef: ElementRef, gridsterPrototype: GridsterPrototypeService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    onDrop(gridster: GridsterService): void;
    onCancel(): void;
    onEnter(gridster: GridsterService): void;
    onOver(gridster: GridsterService): void;
    onOut(gridster: GridsterService): void;
    getPositionToGridster(gridster: GridsterService): {
        y: number;
        x: number;
    };
    setDragContextGridster(gridster: GridsterService): void;
    private getContainerCoordsToGridster(gridster);
    private enableDragDrop();
    private setElementPosition(element, position);
    private updateParentElementData();
    private onStart(event);
    private onDrag(event);
    private onStop(event);
    private provideDragElement();
    private fixStylesForRelativeElement(el);
    /**
     * When element is cloned and append to body it should have position absolute and coords set by original
     * relative prototype element position.
     */
    private fixStylesForBodyHelper(el);
}
