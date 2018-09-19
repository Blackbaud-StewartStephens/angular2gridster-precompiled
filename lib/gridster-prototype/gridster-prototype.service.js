import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, switchMap, map, scan, filter, share, tap } from 'rxjs/operators';
import { utils } from '../utils/utils';
var GridsterPrototypeService = /** @class */ (function () {
    function GridsterPrototypeService() {
        this.isDragging = false;
        this.dragSubject = new Subject();
        this.dragStartSubject = new Subject();
        this.dragStopSubject = new Subject();
    }
    GridsterPrototypeService.prototype.observeDropOver = function (gridster) {
        var _this = this;
        return this.dragStopSubject.pipe(filter(function (data) {
            var gridsterEl = gridster.gridsterComponent.$element;
            var isOverNestedGridster = [].slice.call(gridsterEl.querySelectorAll('gridster'))
                .reduce(function (isOverGridster, nestedGridsterEl) {
                return isOverGridster ||
                    _this.isOverGridster(data.item, nestedGridsterEl, data.event, gridster.options);
            }, false);
            if (isOverNestedGridster) {
                return false;
            }
            return _this.isOverGridster(data.item, gridsterEl, data.event, gridster.options);
        }), tap(function (data) {
            // TODO: what we should provide as a param?
            // prototype.drop.emit({item: prototype.item});
            data.item.onDrop(gridster);
        }));
    };
    GridsterPrototypeService.prototype.observeDropOut = function (gridster) {
        var _this = this;
        return this.dragStopSubject.pipe(filter(function (data) {
            var gridsterEl = gridster.gridsterComponent.$element;
            return !_this.isOverGridster(data.item, gridsterEl, data.event, gridster.options);
        }), tap(function (data) {
            // TODO: what we should provide as a param?
            data.item.onCancel();
        }));
    };
    GridsterPrototypeService.prototype.observeDragOver = function (gridster) {
        var _this = this;
        var over = this.dragSubject.pipe(map(function (data) {
            var gridsterEl = gridster.gridsterComponent.$element;
            return {
                item: data.item,
                event: data.event,
                isOver: _this.isOverGridster(data.item, gridsterEl, data.event, gridster.options),
                isDrop: false
            };
        }));
        var drop = this.dragStopSubject.pipe(map(function (data) {
            var gridsterEl = gridster.gridsterComponent.$element;
            return {
                item: data.item,
                event: data.event,
                isOver: _this.isOverGridster(data.item, gridsterEl, data.event, gridster.options),
                isDrop: true
            };
        }));
        var dragExt = Observable.merge(
        // dragStartSubject is connected in case when item prototype is placed above gridster
        // and drag enter is not fired
        this.dragStartSubject.pipe(map(function () { return ({ item: null, isOver: false, isDrop: false }); })), over, drop).pipe(scan(function (prev, next) {
            return {
                item: next.item,
                event: next.event,
                isOver: next.isOver,
                isEnter: prev.isOver === false && next.isOver === true,
                isOut: prev.isOver === true && next.isOver === false && !prev.isDrop,
                isDrop: next.isDrop
            };
        }), filter(function (data) {
            return !data.isDrop;
        }), share());
        var dragEnter = this.createDragEnterObservable(dragExt, gridster);
        var dragOut = this.createDragOutObservable(dragExt, gridster);
        var dragOver = dragEnter
            .pipe(switchMap(function () { return _this.dragSubject.pipe(takeUntil(dragOut)); }), map(function (data) { return data.item; }));
        return { dragEnter: dragEnter, dragOut: dragOut, dragOver: dragOver };
    };
    GridsterPrototypeService.prototype.dragItemStart = function (item, event) {
        this.isDragging = true;
        this.dragStartSubject.next({ item: item, event: event });
    };
    GridsterPrototypeService.prototype.dragItemStop = function (item, event) {
        this.isDragging = false;
        this.dragStopSubject.next({ item: item, event: event });
    };
    GridsterPrototypeService.prototype.updatePrototypePosition = function (item, event) {
        this.dragSubject.next({ item: item, event: event });
    };
    /**
     * Creates observable that is fired on dragging over gridster container.
     */
    GridsterPrototypeService.prototype.createDragOverObservable = function (dragIsOver, gridster) {
        return dragIsOver.pipe(filter(function (data) { return data.isOver && !data.isEnter && !data.isOut; }), map(function (data) { return data.item; }), tap(function (item) { return item.onOver(gridster); }));
    };
    /**
     * Creates observable that is fired on drag enter gridster container.
     */
    GridsterPrototypeService.prototype.createDragEnterObservable = function (dragIsOver, gridster) {
        return dragIsOver.pipe(filter(function (data) { return data.isEnter; }), map(function (data) { return data.item; }), tap(function (item) { return item.onEnter(gridster); }));
    };
    /**
     * Creates observable that is fired on drag out gridster container.
     */
    GridsterPrototypeService.prototype.createDragOutObservable = function (dragIsOver, gridster) {
        return dragIsOver.pipe(filter(function (data) { return data.isOut; }), map(function (data) { return data.item; }), tap(function (item) { return item.onOut(gridster); }));
    };
    /**
     * Checks whether "element" position fits inside "containerEl" position.
     * It checks if "element" is totally covered by "containerEl" area.
     */
    GridsterPrototypeService.prototype.isOverGridster = function (item, gridsterEl, event, options) {
        var el = item.$element;
        var parentItem = gridsterEl.parentElement &&
            gridsterEl.parentElement.closest('gridster-item');
        if (parentItem) {
            return this.isOverGridster(item, parentItem, event, options);
        }
        switch (options.tolerance) {
            case 'fit':
                return utils.isElementFitContainer(el, gridsterEl);
            case 'intersect':
                return utils.isElementIntersectContainer(el, gridsterEl);
            case 'touch':
                return utils.isElementTouchContainer(el, gridsterEl);
            default:
                return utils.isCursorAboveElement(event, gridsterEl);
        }
    };
    GridsterPrototypeService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [])
    ], GridsterPrototypeService);
    return GridsterPrototypeService;
}());
export { GridsterPrototypeService };
//# sourceMappingURL=gridster-prototype.service.js.map