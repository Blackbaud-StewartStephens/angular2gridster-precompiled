import {
    Component, OnInit, AfterContentInit, OnDestroy, ElementRef, ViewChild, NgZone,
    Input, Output, EventEmitter, ChangeDetectionStrategy, HostBinding, ViewEncapsulation
} from '@angular/core';
import { GridsterService } from './gridster.service';
import { IGridsterOptions } from './IGridsterOptions';
import { IGridsterDraggableOptions } from './IGridsterDraggableOptions';
import { GridsterPrototypeService } from './gridster-prototype/gridster-prototype.service';
import { GridListItem } from './gridList/GridListItem';
import { GridsterOptions } from './GridsterOptions';
@Component({
    selector: 'ngx-gridster',
    template: `<div class="gridster-container">
      <canvas class="gridster-background-grid" #backgroundGrid></canvas>
      <ng-content></ng-content>
      <div class="position-highlight" style="display:none;" #positionHighlight>
        <div class="inner"></div>
      </div>
    </div>`,
    styles: [`
    ngx-gridster {
        position: relative;
        display: block;
        left: 0;
        width: 100%;
    }

    ngx-gridster.gridster--dragging {
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    ngx-gridster .gridster-container {
        position: relative;
        width: 100%;
        list-style: none;
        -webkit-transition: width 0.2s, height 0.2s;
        transition: width 0.2s, height 0.2s;
    }

    ngx-gridster .position-highlight {
        display: block;
        position: absolute;
        z-index: 1;
    }

    ngx-gridster .gridster-background-grid {
        z-index: 0;
        position: relative;
        width: 100%;
        height: 100%
    }
    `],
    providers: [GridsterService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export declare class GridsterComponent implements OnInit, AfterContentInit, OnDestroy {
    private zone;
    private gridsterPrototype;
    @Input() options: IGridsterOptions;
    @Output() optionsChange: EventEmitter<any>;
    @Output() ready: EventEmitter<any>;
    @Output() reflow: EventEmitter<any>;
    @Output() prototypeDrop: EventEmitter<{
        item: GridListItem;
    }>;
    @Output() prototypeEnter: EventEmitter<{
        item: GridListItem;
    }>;
    @Output() prototypeOut: EventEmitter<{
        item: GridListItem;
    }>;
    @Input() draggableOptions: IGridsterDraggableOptions;
    @Input() parent: GridsterComponent;
    @ViewChild('positionHighlight') $positionHighlight: any;
    @ViewChild('backgroundGrid') $backgroundGrid: any;
    @HostBinding('class.gridster--dragging') isDragging: boolean;
    @HostBinding('class.gridster--resizing') isResizing: boolean;
    @HostBinding('class.gridster--ready') isReady: boolean;
    gridster: GridsterService;
    $element: HTMLElement;
    gridsterOptions: GridsterOptions;
    isPrototypeEntered: boolean;
    private isDisabled;
    private subscription;
    constructor(zone: NgZone, elementRef: ElementRef, gridster: GridsterService, gridsterPrototype: GridsterPrototypeService);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /**
     * Change gridster config option and rebuild
     * @param string name
     * @param any value
     * @return GridsterComponent
     */
    setOption(name: keyof IGridsterOptions, value: any): this;
    reload(): this;
    reflowGridster(isInit?: boolean): void;
    updateGridsterElementData(): void;
    setReady(): void;
    adjustItemsHeightToContent(scrollableItemElementSelector?: string): void;
    disable(item: any): void;
    enable(): void;
    private getScrollPositionFromParents(element, data?);
    /**
     * Connect gridster prototype item to gridster dragging hooks (onStart, onDrag, onStop).
     */
    private connectGridsterPrototype();
    private enableDraggable();
    private disableDraggable();
    private enableResizable();
    private disableResizable();
}
