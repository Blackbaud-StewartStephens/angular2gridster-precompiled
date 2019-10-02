import { OnInit, ElementRef, EventEmitter, SimpleChanges, OnChanges, OnDestroy, AfterViewInit, NgZone, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, HostBinding, ViewChild } from '@angular/core';
import { GridsterService } from '../gridster.service';
import { GridListItem } from '../gridList/GridListItem';
@Component({
    selector: 'ngx-gridster-item',
    template: `<div class="gridster-item-inner" [ngStyle]="{position: variableHeight ? 'relative' : ''}">
      <span #contentWrapper class="gridster-content-wrapper">
        <ng-content></ng-content>
      </span>
      <div class="gridster-item-resizable-handler handle-s"></div>
      <div class="gridster-item-resizable-handler handle-e"></div>
      <div class="gridster-item-resizable-handler handle-n"></div>
      <div class="gridster-item-resizable-handler handle-w"></div>
      <div class="gridster-item-resizable-handler handle-se"></div>
      <div class="gridster-item-resizable-handler handle-ne"></div>
      <div class="gridster-item-resizable-handler handle-sw"></div>
      <div class="gridster-item-resizable-handler handle-nw"></div>
    </div>`,
    styles: [`
    ngx-gridster-item {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        -webkit-transition: none;
        transition: none;
    }

    .gridster--ready ngx-gridster-item {
        transition: all 200ms ease;
        transition-property: left, top;
    }

    .gridster--ready.css-transform ngx-gridster-item  {
        transition-property: transform;
    }

    .gridster--ready ngx-gridster-item.is-dragging,
    .gridster--ready ngx-gridster-item.is-resizing {
        -webkit-transition: none;
        transition: none;
        z-index: 9999;
    }

    ngx-gridster-item.no-transition {
        -webkit-transition: none;
        transition: none;
    }
    ngx-gridster-item .gridster-item-resizable-handler {
        position: absolute;
        z-index: 2;
        display: none;
    }

    ngx-gridster-item .gridster-item-resizable-handler.handle-n {
      cursor: n-resize;
      height: 10px;
      right: 0;
      top: 0;
      left: 0;
    }

    ngx-gridster-item .gridster-item-resizable-handler.handle-e {
      cursor: e-resize;
      width: 10px;
      bottom: 0;
      right: 0;
      top: 0;
    }

    ngx-gridster-item .gridster-item-resizable-handler.handle-s {
      cursor: s-resize;
      height: 10px;
      right: 0;
      bottom: 0;
      left: 0;
    }

    ngx-gridster-item .gridster-item-resizable-handler.handle-w {
      cursor: w-resize;
      width: 10px;
      left: 0;
      top: 0;
      bottom: 0;
    }

    ngx-gridster-item .gridster-item-resizable-handler.handle-ne {
      cursor: ne-resize;
      width: 10px;
      height: 10px;
      right: 0;
      top: 0;
    }

    ngx-gridster-item .gridster-item-resizable-handler.handle-nw {
      cursor: nw-resize;
      width: 10px;
      height: 10px;
      left: 0;
      top: 0;
    }

    ngx-gridster-item .gridster-item-resizable-handler.handle-se {
      cursor: se-resize;
      width: 0;
      height: 0;
      right: 0;
      bottom: 0;
      border-style: solid;
      border-width: 0 0 10px 10px;
      border-color: transparent;
    }

    ngx-gridster-item .gridster-item-resizable-handler.handle-sw {
      cursor: sw-resize;
      width: 10px;
      height: 10px;
      left: 0;
      bottom: 0;
    }

    ngx-gridster-item:hover .gridster-item-resizable-handler.handle-se {
      border-color: transparent transparent #ccc
    }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export declare class GridsterItemComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    private zone;
    @Input() x: number;
    @Output() xChange: EventEmitter<number>;
    @Input() y: number;
    @Output() yChange: EventEmitter<number>;
    @Input() xSm: number;
    @Output() xSmChange: EventEmitter<number>;
    @Input() ySm: number;
    @Output() ySmChange: EventEmitter<number>;
    @Input() xMd: number;
    @Output() xMdChange: EventEmitter<number>;
    @Input() yMd: number;
    @Output() yMdChange: EventEmitter<number>;
    @Input() xLg: number;
    @Output() xLgChange: EventEmitter<number>;
    @Input() yLg: number;
    @Output() yLgChange: EventEmitter<number>;
    @Input() xXl: number;
    @Output() xXlChange: EventEmitter<number>;
    @Input() yXl: number;
    @Output() yXlChange: EventEmitter<number>;
    @Input() w: number;
    @Output() wChange: EventEmitter<number>;
    @Input() h: number;
    @Output() hChange: EventEmitter<number>;
    @Input() wSm: number;
    @Output() wSmChange: EventEmitter<number>;
    @Input() hSm: number;
    @Output() hSmChange: EventEmitter<number>;
    @Input() wMd: number;
    @Output() wMdChange: EventEmitter<number>;
    @Input() hMd: number;
    @Output() hMdChange: EventEmitter<number>;
    @Input() wLg: number;
    @Output() wLgChange: EventEmitter<number>;
    @Input() hLg: number;
    @Output() hLgChange: EventEmitter<number>;
    @Input() wXl: number;
    @Output() wXlChange: EventEmitter<number>;
    @Input() hXl: number;
    @Output() hXlChange: EventEmitter<number>;
    @Output() change: EventEmitter<any>;
    @Output() start: EventEmitter<any>;
    @Output() end: EventEmitter<any>;
    @Input() dragAndDrop: boolean;
    @Input() resizable: boolean;
    @Input() options: any;
    @Input() variableHeight: boolean;
    @ViewChild('contentWrapper') contentWrapper: ElementRef;
    autoSize: boolean;
    @HostBinding('class.is-dragging') isDragging: boolean;
    @HostBinding('class.is-resizing') isResizing: boolean;
    $element: HTMLElement;
    elementRef: ElementRef;
    /**
     * Gridster provider service
     */
    gridster: GridsterService;
    item: GridListItem;
    positionX: number;
    positionY: number;
    private _positionX;
    private _positionY;
    private defaultOptions;
    private subscriptions;
    private dragSubscriptions;
    private resizeSubscriptions;
    constructor(zone: NgZone, elementRef: ElementRef, gridster: GridsterService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    updateElemenetPosition(): void;
    setPositionsOnItem(): void;
    enableResizable(): void;
    disableResizable(): void;
    enableDragDrop(): void;
    disableDraggable(): void;
    private getResizeHandlers();
    private getDraggableOptions();
    private getResizableOptions();
    private hasResizableHandle(direction);
    private setPositionsForGrid(options);
    private findPosition(options);
    private createResizeStartObject(direction);
    private onEnd(actionType);
    private onStart(actionType);
    /**
     * Assign class for short while to prevent animation of grid item component
     */
    private preventAnimation();
    private getResizeDirection(handler);
    private resizeElement(config);
    private resizeToNorth(config);
    private resizeToWest(config);
    private resizeToEast(config);
    private resizeToSouth(config);
    private setMinHeight(direction, config);
    private setMinWidth(direction, config);
    private setMaxHeight(direction, config);
    private setMaxWidth(direction, config);
}
