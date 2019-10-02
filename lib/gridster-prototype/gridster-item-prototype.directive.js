import * as tslib_1 from "tslib";
import { Directive, ElementRef, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { GridsterPrototypeService } from './gridster-prototype.service';
import { GridListItem } from '../gridList/GridListItem';
import { Draggable } from '../utils/draggable';
import { utils } from '../utils/utils';
var GridsterItemPrototypeDirective = /** @class */ (function () {
    function GridsterItemPrototypeDirective(zone, elementRef, gridsterPrototype) {
        this.zone = zone;
        this.elementRef = elementRef;
        this.gridsterPrototype = gridsterPrototype;
        this.drop = new EventEmitter();
        this.start = new EventEmitter();
        this.cancel = new EventEmitter();
        this.enter = new EventEmitter();
        this.out = new EventEmitter();
        this.config = {};
        this.x = 0;
        this.y = 0;
        this.variableHeight = false;
        this.variableHeightContainToRow = false;
        this.autoSize = false;
        this.isDragging = false;
        this.subscribtions = [];
        this.item = (new GridListItem()).setFromGridsterItemPrototype(this);
    }
    Object.defineProperty(GridsterItemPrototypeDirective.prototype, "dragAndDrop", {
        // must be set to true because of item dragAndDrop configuration
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterItemPrototypeDirective.prototype, "gridster", {
        get: function () {
            return this.dragContextGridster;
        },
        enumerable: true,
        configurable: true
    });
    GridsterItemPrototypeDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.wSm = this.wSm || this.w;
        this.hSm = this.hSm || this.h;
        this.wMd = this.wMd || this.w;
        this.hMd = this.hMd || this.h;
        this.wLg = this.wLg || this.w;
        this.hLg = this.hLg || this.h;
        this.wXl = this.wXl || this.w;
        this.hXl = this.hXl || this.h;
        this.zone.runOutsideAngular(function () {
            _this.enableDragDrop();
        });
    };
    GridsterItemPrototypeDirective.prototype.ngOnDestroy = function () {
        this.subscribtions.forEach(function (sub) {
            sub.unsubscribe();
        });
    };
    GridsterItemPrototypeDirective.prototype.onDrop = function (gridster) {
        if (!this.config.helper) {
            this.$element.parentNode.removeChild(this.$element);
        }
        this.drop.emit({
            item: this.item,
            gridster: gridster
        });
    };
    GridsterItemPrototypeDirective.prototype.onCancel = function () {
        this.cancel.emit({ item: this.item });
    };
    GridsterItemPrototypeDirective.prototype.onEnter = function (gridster) {
        this.enter.emit({
            item: this.item,
            gridster: gridster
        });
    };
    GridsterItemPrototypeDirective.prototype.onOver = function (gridster) { };
    GridsterItemPrototypeDirective.prototype.onOut = function (gridster) {
        this.out.emit({
            item: this.item,
            gridster: gridster
        });
    };
    GridsterItemPrototypeDirective.prototype.getPositionToGridster = function (gridster) {
        var relativeContainerCoords = this.getContainerCoordsToGridster(gridster);
        return {
            y: this.positionY - relativeContainerCoords.top,
            x: this.positionX - relativeContainerCoords.left
        };
    };
    GridsterItemPrototypeDirective.prototype.setDragContextGridster = function (gridster) {
        this.dragContextGridster = gridster;
    };
    GridsterItemPrototypeDirective.prototype.getContainerCoordsToGridster = function (gridster) {
        return {
            left: gridster.gridsterRect.left - this.parentRect.left,
            top: gridster.gridsterRect.top - this.parentRect.top
        };
    };
    GridsterItemPrototypeDirective.prototype.enableDragDrop = function () {
        var _this = this;
        var cursorToElementPosition;
        var draggable = new Draggable(this.elementRef.nativeElement);
        var dragStartSub = draggable.dragStart
            .subscribe(function (event) {
            _this.zone.run(function () {
                _this.$element = _this.provideDragElement();
                _this.containerRectange = _this.$element.parentElement.getBoundingClientRect();
                _this.updateParentElementData();
                _this.onStart(event);
                cursorToElementPosition = event.getRelativeCoordinates(_this.$element);
            });
        });
        var dragSub = draggable.dragMove
            .subscribe(function (event) {
            _this.setElementPosition(_this.$element, {
                x: event.clientX - cursorToElementPosition.x - _this.parentRect.left,
                y: event.clientY - cursorToElementPosition.y - _this.parentRect.top
            });
            _this.onDrag(event);
        });
        var dragStopSub = draggable.dragStop
            .subscribe(function (event) {
            _this.zone.run(function () {
                _this.onStop(event);
                _this.$element = null;
            });
        });
        var scrollSub = Observable.fromEvent(document, 'scroll')
            .subscribe(function () {
            if (_this.$element) {
                _this.updateParentElementData();
            }
        });
        this.subscribtions = this.subscribtions.concat([dragStartSub, dragSub, dragStopSub, scrollSub]);
    };
    GridsterItemPrototypeDirective.prototype.setElementPosition = function (element, position) {
        this.positionX = position.x;
        this.positionY = position.y;
        utils.setCssElementPosition(element, position);
    };
    GridsterItemPrototypeDirective.prototype.updateParentElementData = function () {
        this.parentRect = this.$element.parentElement.getBoundingClientRect();
        this.parentOffset = {
            left: this.$element.parentElement.offsetLeft,
            top: this.$element.parentElement.offsetTop
        };
    };
    GridsterItemPrototypeDirective.prototype.onStart = function (event) {
        this.isDragging = true;
        this.$element.style.pointerEvents = 'none';
        this.$element.style.position = 'absolute';
        this.gridsterPrototype.dragItemStart(this, event);
        this.start.emit({ item: this.item });
    };
    GridsterItemPrototypeDirective.prototype.onDrag = function (event) {
        this.gridsterPrototype.updatePrototypePosition(this, event);
    };
    GridsterItemPrototypeDirective.prototype.onStop = function (event) {
        this.gridsterPrototype.dragItemStop(this, event);
        this.isDragging = false;
        this.$element.style.pointerEvents = 'auto';
        this.$element.style.position = '';
        utils.resetCSSElementPosition(this.$element);
        if (this.config.helper) {
            this.$element.parentNode.removeChild(this.$element);
        }
    };
    GridsterItemPrototypeDirective.prototype.provideDragElement = function () {
        var dragElement = this.elementRef.nativeElement;
        if (this.config.helper) {
            dragElement = (dragElement).cloneNode(true);
            document.body.appendChild(this.fixStylesForBodyHelper(dragElement));
        }
        else {
            this.fixStylesForRelativeElement(dragElement);
        }
        return dragElement;
    };
    GridsterItemPrototypeDirective.prototype.fixStylesForRelativeElement = function (el) {
        if (window.getComputedStyle(el).position === 'absolute') {
            return el;
        }
        var rect = this.elementRef.nativeElement.getBoundingClientRect();
        this.containerRectange = el.parentElement.getBoundingClientRect();
        el.style.position = 'absolute';
        this.setElementPosition(el, {
            x: rect.left - this.containerRectange.left,
            y: rect.top - this.containerRectange.top
        });
        return el;
    };
    /**
     * When element is cloned and append to body it should have position absolute and coords set by original
     * relative prototype element position.
     */
    GridsterItemPrototypeDirective.prototype.fixStylesForBodyHelper = function (el) {
        var bodyRect = document.body.getBoundingClientRect();
        var rect = this.elementRef.nativeElement.getBoundingClientRect();
        el.style.position = 'absolute';
        this.setElementPosition(el, {
            x: rect.left - bodyRect.left,
            y: rect.top - bodyRect.top
        });
        return el;
    };
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemPrototypeDirective.prototype, "drop", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemPrototypeDirective.prototype, "start", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemPrototypeDirective.prototype, "cancel", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemPrototypeDirective.prototype, "enter", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemPrototypeDirective.prototype, "out", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemPrototypeDirective.prototype, "data", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemPrototypeDirective.prototype, "config", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemPrototypeDirective.prototype, "w", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemPrototypeDirective.prototype, "wSm", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemPrototypeDirective.prototype, "wMd", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemPrototypeDirective.prototype, "wLg", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemPrototypeDirective.prototype, "wXl", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemPrototypeDirective.prototype, "h", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemPrototypeDirective.prototype, "hSm", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemPrototypeDirective.prototype, "hMd", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemPrototypeDirective.prototype, "hLg", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemPrototypeDirective.prototype, "hXl", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], GridsterItemPrototypeDirective.prototype, "variableHeight", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], GridsterItemPrototypeDirective.prototype, "variableHeightContainToRow", void 0);
    GridsterItemPrototypeDirective = tslib_1.__decorate([
        Directive({
            selector: '[ngxGridsterItemPrototype]'
        }),
        tslib_1.__metadata("design:paramtypes", [NgZone,
            ElementRef,
            GridsterPrototypeService])
    ], GridsterItemPrototypeDirective);
    return GridsterItemPrototypeDirective;
}());
export { GridsterItemPrototypeDirective };
//# sourceMappingURL=gridster-item-prototype.directive.js.map