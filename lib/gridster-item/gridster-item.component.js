import * as tslib_1 from "tslib";
import { Component, ElementRef, Inject, Input, Output, EventEmitter, HostBinding, ChangeDetectionStrategy, NgZone, ViewEncapsulation, ViewChild } from '@angular/core';
import { GridsterService } from '../gridster.service';
import { GridListItem } from '../gridList/GridListItem';
import { Draggable } from '../utils/draggable';
import { GridList } from '../gridList/gridList';
import { utils } from '../utils/utils';
var GridsterItemComponent = /** @class */ (function () {
    function GridsterItemComponent(zone, elementRef, gridster) {
        this.zone = zone;
        this.xChange = new EventEmitter(true);
        this.yChange = new EventEmitter(true);
        this.xSmChange = new EventEmitter(true);
        this.ySmChange = new EventEmitter(true);
        this.xMdChange = new EventEmitter(true);
        this.yMdChange = new EventEmitter(true);
        this.xLgChange = new EventEmitter(true);
        this.yLgChange = new EventEmitter(true);
        this.xXlChange = new EventEmitter(true);
        this.yXlChange = new EventEmitter(true);
        this.wChange = new EventEmitter(true);
        this.hChange = new EventEmitter(true);
        this.wSmChange = new EventEmitter(true);
        this.hSmChange = new EventEmitter(true);
        this.wMdChange = new EventEmitter(true);
        this.hMdChange = new EventEmitter(true);
        this.wLgChange = new EventEmitter(true);
        this.hLgChange = new EventEmitter(true);
        this.wXlChange = new EventEmitter(true);
        this.hXlChange = new EventEmitter(true);
        this.change = new EventEmitter(true);
        this.start = new EventEmitter(true);
        this.end = new EventEmitter(true);
        this.dragAndDrop = true;
        this.resizable = true;
        this.options = {};
        this.variableHeight = false;
        this.isDragging = false;
        this.isResizing = false;
        this.defaultOptions = {
            minWidth: 1,
            minHeight: 1,
            maxWidth: Infinity,
            maxHeight: Infinity,
            defaultWidth: 1,
            defaultHeight: 1
        };
        this.subscriptions = [];
        this.dragSubscriptions = [];
        this.resizeSubscriptions = [];
        this.gridster = gridster;
        this.elementRef = elementRef;
        this.$element = elementRef.nativeElement;
        this.item = (new GridListItem()).setFromGridsterItem(this);
        // if gridster is initialized do not show animation on new grid-item construct
        if (this.gridster.isInitialized()) {
            this.preventAnimation();
        }
    }
    Object.defineProperty(GridsterItemComponent.prototype, "positionX", {
        get: function () {
            return this._positionX;
        },
        set: function (value) {
            this._positionX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterItemComponent.prototype, "positionY", {
        get: function () {
            return this._positionY;
        },
        set: function (value) {
            this._positionY = value;
        },
        enumerable: true,
        configurable: true
    });
    GridsterItemComponent.prototype.ngOnInit = function () {
        this.options = Object.assign(this.defaultOptions, this.options);
        this.w = this.w || this.options.defaultWidth;
        this.h = this.h || this.options.defaultHeight;
        this.wSm = this.wSm || this.w;
        this.hSm = this.hSm || this.h;
        this.wMd = this.wMd || this.w;
        this.hMd = this.hMd || this.h;
        this.wLg = this.wLg || this.w;
        this.hLg = this.hLg || this.h;
        this.wXl = this.wXl || this.w;
        this.hXl = this.hXl || this.h;
        if (this.gridster.isInitialized()) {
            this.setPositionsOnItem();
        }
        this.gridster.registerItem(this.item);
        this.gridster.calculateCellSize();
        this.item.applySize();
        this.item.applyPosition();
        if (this.gridster.options.dragAndDrop && this.dragAndDrop) {
            this.enableDragDrop();
        }
        if (this.gridster.isInitialized()) {
            this.gridster.render();
            this.gridster.updateCachedItems();
        }
    };
    GridsterItemComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.gridster.options.resizable && this.item.resizable) {
            this.enableResizable();
        }
        if (this.variableHeight) {
            var readySubscription_1 = this.gridster.gridsterComponent.ready.subscribe(function () {
                _this.gridster.gridList.resizeItem(_this.item, { w: _this.w, h: 1 });
                readySubscription_1.unsubscribe();
            });
            var lastOffsetHeight_1;
            var observer = new MutationObserver(function (mutations) {
                var offsetHeight = _this.item.contentHeight;
                if (offsetHeight !== lastOffsetHeight_1) {
                    for (var _i = 0, _a = _this.gridster.items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        item.applySize();
                        item.applyPosition();
                    }
                }
                lastOffsetHeight_1 = offsetHeight;
            });
            observer.observe(this.contentWrapper.nativeElement, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true
            });
        }
    };
    GridsterItemComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (!this.gridster.gridList) {
            return;
        }
        var rerender = false;
        ['w'].concat(Object.keys(GridListItem.W_PROPERTY_MAP).map(function (breakpoint) { return GridListItem.W_PROPERTY_MAP[breakpoint]; })).filter(function (propName) { return changes[propName] && !changes[propName].isFirstChange(); })
            .forEach(function (propName) {
            if (changes[propName].currentValue > _this.options.maxWidth) {
                _this[propName] = _this.options.maxWidth;
                setTimeout(function () { return _this[(propName + 'Change')].emit(_this[propName]); });
            }
            rerender = true;
        });
        ['h'].concat(Object.keys(GridListItem.H_PROPERTY_MAP).map(function (breakpoint) { return GridListItem.H_PROPERTY_MAP[breakpoint]; })).filter(function (propName) { return changes[propName] && !changes[propName].isFirstChange(); })
            .forEach(function (propName) {
            if (changes[propName].currentValue > _this.options.maxHeight) {
                _this[propName] = _this.options.maxHeight;
                setTimeout(function () { return _this[(propName + 'Change')].emit(_this[propName]); });
            }
            rerender = true;
        });
        ['x', 'y'].concat(Object.keys(GridListItem.X_PROPERTY_MAP).map(function (breakpoint) { return GridListItem.X_PROPERTY_MAP[breakpoint]; }), Object.keys(GridListItem.Y_PROPERTY_MAP).map(function (breakpoint) { return GridListItem.Y_PROPERTY_MAP[breakpoint]; })).filter(function (propName) { return changes[propName] && !changes[propName].isFirstChange(); })
            .forEach(function (propName) { return rerender = true; });
        if (changes['dragAndDrop'] && !changes['dragAndDrop'].isFirstChange()) {
            if (changes['dragAndDrop'].currentValue && this.gridster.options.dragAndDrop) {
                this.enableDragDrop();
            }
            else {
                this.disableDraggable();
            }
        }
        if (changes['resizable'] && !changes['resizable'].isFirstChange()) {
            if (changes['resizable'].currentValue && this.gridster.options.resizable) {
                this.enableResizable();
            }
            else {
                this.disableResizable();
            }
        }
        if (rerender && this.gridster.gridsterComponent.isReady) {
            this.gridster.debounceRenderSubject.next();
        }
    };
    GridsterItemComponent.prototype.ngOnDestroy = function () {
        this.gridster.removeItem(this.item);
        this.gridster.itemRemoveSubject.next(this.item);
        this.subscriptions.forEach(function (sub) {
            sub.unsubscribe();
        });
        this.disableDraggable();
        this.disableResizable();
    };
    GridsterItemComponent.prototype.updateElemenetPosition = function () {
        if (this.gridster.options.useCSSTransforms) {
            utils.setTransform(this.$element, { x: this._positionX, y: this._positionY });
        }
        else {
            utils.setCssElementPosition(this.$element, { x: this._positionX, y: this._positionY });
        }
    };
    GridsterItemComponent.prototype.setPositionsOnItem = function () {
        var _this = this;
        if (!this.item.hasPositions(this.gridster.options.breakpoint)) {
            this.setPositionsForGrid(this.gridster.options);
        }
        this.gridster.gridsterOptions.responsiveOptions
            .filter(function (options) { return !_this.item.hasPositions(options.breakpoint); })
            .forEach(function (options) { return _this.setPositionsForGrid(options); });
    };
    GridsterItemComponent.prototype.enableResizable = function () {
        var _this = this;
        if (this.resizeSubscriptions.length) {
            return;
        }
        this.zone.runOutsideAngular(function () {
            _this.getResizeHandlers().forEach(function (handler) {
                var direction = _this.getResizeDirection(handler);
                if (_this.hasResizableHandle(direction)) {
                    handler.style.display = 'block';
                }
                var draggable = new Draggable(handler, _this.getResizableOptions());
                var startEvent;
                var startData;
                var cursorToElementPosition;
                var dragStartSub = draggable.dragStart
                    .subscribe(function (event) {
                    _this.zone.run(function () {
                        _this.isResizing = true;
                        startEvent = event;
                        startData = _this.createResizeStartObject(direction);
                        cursorToElementPosition = event.getRelativeCoordinates(_this.$element);
                        _this.gridster.onResizeStart(_this.item);
                        _this.onStart('resize');
                    });
                });
                var dragSub = draggable.dragMove
                    .subscribe(function (event) {
                    var scrollData = _this.gridster.gridsterScrollData;
                    _this.resizeElement({
                        direction: direction,
                        startData: startData,
                        position: {
                            x: event.clientX - cursorToElementPosition.x - _this.gridster.gridsterRect.left,
                            y: event.clientY - cursorToElementPosition.y - _this.gridster.gridsterRect.top
                        },
                        startEvent: startEvent,
                        moveEvent: event,
                        scrollDiffX: scrollData.scrollLeft - startData.scrollLeft,
                        scrollDiffY: scrollData.scrollTop - startData.scrollTop
                    });
                    _this.gridster.onResizeDrag(_this.item);
                });
                var dragStopSub = draggable.dragStop
                    .subscribe(function () {
                    _this.zone.run(function () {
                        _this.isResizing = false;
                        _this.gridster.onResizeStop(_this.item);
                        _this.onEnd('resize');
                    });
                });
                _this.resizeSubscriptions = _this.resizeSubscriptions.concat([dragStartSub, dragSub, dragStopSub]);
            });
        });
    };
    GridsterItemComponent.prototype.disableResizable = function () {
        this.resizeSubscriptions.forEach(function (sub) {
            sub.unsubscribe();
        });
        this.resizeSubscriptions = [];
        [].forEach.call(this.$element.querySelectorAll('.gridster-item-resizable-handler'), function (handler) {
            handler.style.display = '';
        });
    };
    GridsterItemComponent.prototype.enableDragDrop = function () {
        var _this = this;
        if (this.dragSubscriptions.length) {
            return;
        }
        this.zone.runOutsideAngular(function () {
            var cursorToElementPosition;
            var draggable = new Draggable(_this.$element, _this.getDraggableOptions());
            var dragStartSub = draggable.dragStart
                .subscribe(function (event) {
                _this.zone.run(function () {
                    _this.gridster.onStart(_this.item);
                    _this.isDragging = true;
                    _this.onStart('drag');
                    cursorToElementPosition = event.getRelativeCoordinates(_this.$element);
                });
            });
            var dragSub = draggable.dragMove
                .subscribe(function (event) {
                _this.positionY = (event.clientY - cursorToElementPosition.y -
                    _this.gridster.gridsterRect.top);
                _this.positionX = (event.clientX - cursorToElementPosition.x -
                    _this.gridster.gridsterRect.left);
                _this.updateElemenetPosition();
                _this.gridster.onDrag(_this.item);
            });
            var dragStopSub = draggable.dragStop
                .subscribe(function () {
                _this.zone.run(function () {
                    _this.gridster.onStop(_this.item);
                    _this.gridster.debounceRenderSubject.next();
                    _this.isDragging = false;
                    _this.onEnd('drag');
                });
            });
            _this.dragSubscriptions = _this.dragSubscriptions.concat([dragStartSub, dragSub, dragStopSub]);
        });
    };
    GridsterItemComponent.prototype.disableDraggable = function () {
        this.dragSubscriptions.forEach(function (sub) {
            sub.unsubscribe();
        });
        this.dragSubscriptions = [];
    };
    GridsterItemComponent.prototype.getResizeHandlers = function () {
        return [].filter.call(this.$element.children[0].children, function (el) {
            return el.classList.contains('gridster-item-resizable-handler');
        });
    };
    GridsterItemComponent.prototype.getDraggableOptions = function () {
        return tslib_1.__assign({ scrollDirection: this.gridster.options.direction }, this.gridster.draggableOptions);
    };
    GridsterItemComponent.prototype.getResizableOptions = function () {
        var resizableOptions = {};
        if (this.gridster.draggableOptions.scroll || this.gridster.draggableOptions.scroll === false) {
            resizableOptions.scroll = this.gridster.draggableOptions.scroll;
        }
        if (this.gridster.draggableOptions.scrollEdge) {
            resizableOptions.scrollEdge = this.gridster.draggableOptions.scrollEdge;
        }
        resizableOptions.scrollDirection = this.gridster.options.direction;
        return resizableOptions;
    };
    GridsterItemComponent.prototype.hasResizableHandle = function (direction) {
        var isItemResizable = this.gridster.options.resizable && this.item.resizable;
        var resizeHandles = this.gridster.options.resizeHandles;
        return isItemResizable && (!resizeHandles || (resizeHandles && !!resizeHandles[direction]));
    };
    GridsterItemComponent.prototype.setPositionsForGrid = function (options) {
        var _this = this;
        var x, y;
        var position = this.findPosition(options);
        x = options.direction === 'horizontal' ? position[0] : position[1];
        y = options.direction === 'horizontal' ? position[1] : position[0];
        this.item.setValueX(x, options.breakpoint);
        this.item.setValueY(y, options.breakpoint);
        setTimeout(function () {
            _this.item.triggerChangeX(options.breakpoint);
            _this.item.triggerChangeY(options.breakpoint);
        });
    };
    GridsterItemComponent.prototype.findPosition = function (options) {
        var gridList = new GridList(this.gridster.items.map(function (item) { return item.copyForBreakpoint(options.breakpoint); }), options);
        return gridList.findPositionForItem(this.item, { x: 0, y: 0 });
    };
    GridsterItemComponent.prototype.createResizeStartObject = function (direction) {
        var scrollData = this.gridster.gridsterScrollData;
        return {
            top: this.positionY,
            left: this.positionX,
            height: parseInt(this.$element.style.height, 10),
            width: parseInt(this.$element.style.width, 10),
            minX: Math.max(this.item.x + this.item.w - this.options.maxWidth, 0),
            maxX: this.item.x + this.item.w - this.options.minWidth,
            minY: Math.max(this.item.y + this.item.h - this.options.maxHeight, 0),
            maxY: this.item.y + this.item.h - this.options.minHeight,
            minW: this.options.minWidth,
            maxW: Math.min(this.options.maxWidth, (this.gridster.options.direction === 'vertical' && direction.indexOf('w') < 0) ?
                this.gridster.options.lanes - this.item.x : this.options.maxWidth, direction.indexOf('w') >= 0 ?
                this.item.x + this.item.w : this.options.maxWidth),
            minH: this.options.minHeight,
            maxH: Math.min(this.options.maxHeight, (this.gridster.options.direction === 'horizontal' && direction.indexOf('n') < 0) ?
                this.gridster.options.lanes - this.item.y : this.options.maxHeight, direction.indexOf('n') >= 0 ?
                this.item.y + this.item.h : this.options.maxHeight),
            scrollLeft: scrollData.scrollLeft,
            scrollTop: scrollData.scrollTop
        };
    };
    GridsterItemComponent.prototype.onEnd = function (actionType) {
        this.end.emit({ action: actionType, item: this.item });
    };
    GridsterItemComponent.prototype.onStart = function (actionType) {
        this.start.emit({ action: actionType, item: this.item });
    };
    /**
     * Assign class for short while to prevent animation of grid item component
     */
    GridsterItemComponent.prototype.preventAnimation = function () {
        var _this = this;
        this.$element.classList.add('no-transition');
        setTimeout(function () {
            _this.$element.classList.remove('no-transition');
        }, 500);
        return this;
    };
    GridsterItemComponent.prototype.getResizeDirection = function (handler) {
        for (var i = handler.classList.length - 1; i >= 0; i--) {
            if (handler.classList[i].match('handle-')) {
                return handler.classList[i].split('-')[1];
            }
        }
    };
    GridsterItemComponent.prototype.resizeElement = function (config) {
        // north
        if (config.direction.indexOf('n') >= 0) {
            this.resizeToNorth(config);
        }
        // west
        if (config.direction.indexOf('w') >= 0) {
            this.resizeToWest(config);
        }
        // east
        if (config.direction.indexOf('e') >= 0) {
            this.resizeToEast(config);
        }
        // south
        if (config.direction.indexOf('s') >= 0) {
            this.resizeToSouth(config);
        }
    };
    GridsterItemComponent.prototype.resizeToNorth = function (config) {
        var height = config.startData.height + config.startEvent.clientY -
            config.moveEvent.clientY - config.scrollDiffY;
        if (height < (config.startData.minH * this.gridster.cellHeight)) {
            this.setMinHeight('n', config);
        }
        else if (height > (config.startData.maxH * this.gridster.cellHeight)) {
            this.setMaxHeight('n', config);
        }
        else {
            this.positionY = config.position.y;
            this.$element.style.height = height + 'px';
        }
    };
    GridsterItemComponent.prototype.resizeToWest = function (config) {
        var width = config.startData.width + config.startEvent.clientX -
            config.moveEvent.clientX - config.scrollDiffX;
        if (width < (config.startData.minW * this.gridster.cellWidth)) {
            this.setMinWidth('w', config);
        }
        else if (width > (config.startData.maxW * this.gridster.cellWidth)) {
            this.setMaxWidth('w', config);
        }
        else {
            this.positionX = config.position.x;
            this.updateElemenetPosition();
            this.$element.style.width = width + 'px';
        }
    };
    GridsterItemComponent.prototype.resizeToEast = function (config) {
        var width = config.startData.width + config.moveEvent.clientX -
            config.startEvent.clientX + config.scrollDiffX;
        if (width > (config.startData.maxW * this.gridster.cellWidth)) {
            this.setMaxWidth('e', config);
        }
        else if (width < (config.startData.minW * this.gridster.cellWidth)) {
            this.setMinWidth('e', config);
        }
        else {
            this.$element.style.width = width + 'px';
        }
    };
    GridsterItemComponent.prototype.resizeToSouth = function (config) {
        var height = config.startData.height + config.moveEvent.clientY -
            config.startEvent.clientY + config.scrollDiffY;
        if (height > config.startData.maxH * this.gridster.cellHeight) {
            this.setMaxHeight('s', config);
        }
        else if (height < config.startData.minH * this.gridster.cellHeight) {
            this.setMinHeight('s', config);
        }
        else {
            this.$element.style.height = height + 'px';
        }
    };
    GridsterItemComponent.prototype.setMinHeight = function (direction, config) {
        if (direction === 'n') {
            this.$element.style.height = (config.startData.minH * this.gridster.cellHeight) + 'px';
            this.positionY = config.startData.maxY * this.gridster.cellHeight;
        }
        else {
            this.$element.style.height = (config.startData.minH * this.gridster.cellHeight) + 'px';
        }
    };
    GridsterItemComponent.prototype.setMinWidth = function (direction, config) {
        if (direction === 'w') {
            this.$element.style.width = (config.startData.minW * this.gridster.cellWidth) + 'px';
            this.positionX = config.startData.maxX * this.gridster.cellWidth;
            this.updateElemenetPosition();
        }
        else {
            this.$element.style.width = (config.startData.minW * this.gridster.cellWidth) + 'px';
        }
    };
    GridsterItemComponent.prototype.setMaxHeight = function (direction, config) {
        if (direction === 'n') {
            this.$element.style.height = (config.startData.maxH * this.gridster.cellHeight) + 'px';
            this.positionY = config.startData.minY * this.gridster.cellHeight;
        }
        else {
            this.$element.style.height = (config.startData.maxH * this.gridster.cellHeight) + 'px';
        }
    };
    GridsterItemComponent.prototype.setMaxWidth = function (direction, config) {
        if (direction === 'w') {
            this.$element.style.width = (config.startData.maxW * this.gridster.cellWidth) + 'px';
            this.positionX = config.startData.minX * this.gridster.cellWidth;
            this.updateElemenetPosition();
        }
        else {
            this.$element.style.width = (config.startData.maxW * this.gridster.cellWidth) + 'px';
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "x", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "xChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "y", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "yChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "xSm", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "xSmChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "ySm", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "ySmChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "xMd", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "xMdChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "yMd", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "yMdChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "xLg", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "xLgChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "yLg", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "yLgChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "xXl", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "xXlChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "yXl", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "yXlChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "w", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "wChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "h", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "hChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "wSm", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "wSmChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "hSm", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "hSmChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "wMd", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "wMdChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "hMd", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "hMdChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "wLg", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "wLgChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "hLg", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "hLgChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "wXl", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "wXlChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], GridsterItemComponent.prototype, "hXl", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "hXlChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "start", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "end", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "dragAndDrop", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "resizable", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "options", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "variableHeight", void 0);
    tslib_1.__decorate([
        ViewChild('contentWrapper'),
        tslib_1.__metadata("design:type", ElementRef)
    ], GridsterItemComponent.prototype, "contentWrapper", void 0);
    tslib_1.__decorate([
        HostBinding('class.is-dragging'),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "isDragging", void 0);
    tslib_1.__decorate([
        HostBinding('class.is-resizing'),
        tslib_1.__metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "isResizing", void 0);
    GridsterItemComponent = tslib_1.__decorate([
        Component({
            selector: 'ngx-gridster-item',
            template: "<div class=\"gridster-item-inner\" [ngStyle]=\"{position: variableHeight ? 'relative' : ''}\">\n      <span #contentWrapper class=\"gridster-content-wrapper\">\n        <ng-content></ng-content>\n      </span>\n      <div class=\"gridster-item-resizable-handler handle-s\"></div>\n      <div class=\"gridster-item-resizable-handler handle-e\"></div>\n      <div class=\"gridster-item-resizable-handler handle-n\"></div>\n      <div class=\"gridster-item-resizable-handler handle-w\"></div>\n      <div class=\"gridster-item-resizable-handler handle-se\"></div>\n      <div class=\"gridster-item-resizable-handler handle-ne\"></div>\n      <div class=\"gridster-item-resizable-handler handle-sw\"></div>\n      <div class=\"gridster-item-resizable-handler handle-nw\"></div>\n    </div>",
            styles: ["\n    ngx-gridster-item {\n        display: block;\n        position: absolute;\n        top: 0;\n        left: 0;\n        z-index: 1;\n        -webkit-transition: none;\n        transition: none;\n    }\n\n    .gridster--ready ngx-gridster-item {\n        transition: all 200ms ease;\n        transition-property: left, top;\n    }\n\n    .gridster--ready.css-transform ngx-gridster-item  {\n        transition-property: transform;\n    }\n\n    .gridster--ready ngx-gridster-item.is-dragging,\n    .gridster--ready ngx-gridster-item.is-resizing {\n        -webkit-transition: none;\n        transition: none;\n        z-index: 9999;\n    }\n\n    ngx-gridster-item.no-transition {\n        -webkit-transition: none;\n        transition: none;\n    }\n    ngx-gridster-item .gridster-item-resizable-handler {\n        position: absolute;\n        z-index: 2;\n        display: none;\n    }\n\n    ngx-gridster-item .gridster-item-resizable-handler.handle-n {\n      cursor: n-resize;\n      height: 10px;\n      right: 0;\n      top: 0;\n      left: 0;\n    }\n\n    ngx-gridster-item .gridster-item-resizable-handler.handle-e {\n      cursor: e-resize;\n      width: 10px;\n      bottom: 0;\n      right: 0;\n      top: 0;\n    }\n\n    ngx-gridster-item .gridster-item-resizable-handler.handle-s {\n      cursor: s-resize;\n      height: 10px;\n      right: 0;\n      bottom: 0;\n      left: 0;\n    }\n\n    ngx-gridster-item .gridster-item-resizable-handler.handle-w {\n      cursor: w-resize;\n      width: 10px;\n      left: 0;\n      top: 0;\n      bottom: 0;\n    }\n\n    ngx-gridster-item .gridster-item-resizable-handler.handle-ne {\n      cursor: ne-resize;\n      width: 10px;\n      height: 10px;\n      right: 0;\n      top: 0;\n    }\n\n    ngx-gridster-item .gridster-item-resizable-handler.handle-nw {\n      cursor: nw-resize;\n      width: 10px;\n      height: 10px;\n      left: 0;\n      top: 0;\n    }\n\n    ngx-gridster-item .gridster-item-resizable-handler.handle-se {\n      cursor: se-resize;\n      width: 0;\n      height: 0;\n      right: 0;\n      bottom: 0;\n      border-style: solid;\n      border-width: 0 0 10px 10px;\n      border-color: transparent;\n    }\n\n    ngx-gridster-item .gridster-item-resizable-handler.handle-sw {\n      cursor: sw-resize;\n      width: 10px;\n      height: 10px;\n      left: 0;\n      bottom: 0;\n    }\n\n    ngx-gridster-item:hover .gridster-item-resizable-handler.handle-se {\n      border-color: transparent transparent #ccc\n    }\n    "],
            changeDetection: ChangeDetectionStrategy.OnPush,
            encapsulation: ViewEncapsulation.None
        }),
        tslib_1.__param(1, Inject(ElementRef)),
        tslib_1.__param(2, Inject(GridsterService)),
        tslib_1.__metadata("design:paramtypes", [NgZone,
            ElementRef,
            GridsterService])
    ], GridsterItemComponent);
    return GridsterItemComponent;
}());
export { GridsterItemComponent };
//# sourceMappingURL=gridster-item.component.js.map