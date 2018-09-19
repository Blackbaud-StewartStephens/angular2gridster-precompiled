import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GridList } from './gridList/gridList';
var GridsterService = /** @class */ (function () {
    function GridsterService() {
        var _this = this;
        this.items = [];
        this._items = [];
        this._itemsMap = {};
        this.disabledItems = [];
        this.debounceRenderSubject = new Subject();
        this.itemRemoveSubject = new Subject();
        this.isInit = false;
        this.itemRemoveSubject.pipe(debounceTime(0)).subscribe(function () {
            _this.gridList.pullItemsToLeft();
            _this.render();
            _this.updateCachedItems();
        });
        this.debounceRenderSubject.pipe(debounceTime(0)).subscribe(function () { return _this.render(); });
    }
    GridsterService.prototype.isInitialized = function () {
        return this.isInit;
    };
    /**
     * Must be called before init
     * @param item
     */
    GridsterService.prototype.registerItem = function (item) {
        this.items.push(item);
        return item;
    };
    GridsterService.prototype.init = function (gridsterComponent) {
        this.gridsterComponent = gridsterComponent;
        this.draggableOptions = gridsterComponent.draggableOptions;
        this.gridsterOptions = gridsterComponent.gridsterOptions;
    };
    GridsterService.prototype.start = function () {
        var _this = this;
        this.updateMaxItemSize();
        // Used to highlight a position an element will land on upon drop
        if (this.$positionHighlight) {
            this.removePositionHighlight();
        }
        this.initGridList();
        this.isInit = true;
        setTimeout(function () {
            _this.copyItems();
            _this.fixItemsPositions();
            _this.gridsterComponent.reflowGridster(true);
            _this.gridsterComponent.setReady();
        });
    };
    GridsterService.prototype.initGridList = function () {
        // Create instance of GridList (decoupled lib for handling the grid
        // positioning and sorting post-drag and dropping)
        this.gridList = new GridList(this.items, this.options);
    };
    GridsterService.prototype.render = function () {
        this.updateMaxItemSize();
        this.gridList.generateGrid();
        this.applySizeToItems();
        this.applyPositionToItems();
        this.refreshLines();
    };
    GridsterService.prototype.reflow = function () {
        this.calculateCellSize();
        this.render();
    };
    GridsterService.prototype.fixItemsPositions = function () {
        var _this = this;
        if (this.options.responsiveSizes) {
            this.gridList.fixItemsPositions(this.options);
        }
        else {
            this.gridList.fixItemsPositions(this.gridsterOptions.basicOptions);
            this.gridsterOptions.responsiveOptions.forEach(function (options) {
                _this.gridList.fixItemsPositions(options);
            });
        }
        this.updateCachedItems();
    };
    GridsterService.prototype.removeItem = function (item) {
        var idx = this.items.indexOf(item);
        if (idx >= 0) {
            this.items.splice(this.items.indexOf(item), 1);
        }
        this.gridList.deleteItemPositionFromGrid(item);
        this.removeItemFromCache(item);
    };
    GridsterService.prototype.onResizeStart = function (item) {
        this.currentElement = item.$element;
        this.copyItems();
        this._maxGridCols = this.gridList.grid.length;
        this.highlightPositionForItem(item);
        this.gridsterComponent.isResizing = true;
        this.refreshLines();
    };
    GridsterService.prototype.onResizeDrag = function (item) {
        var newSize = this.snapItemSizeToGrid(item);
        var sizeChanged = this.dragSizeChanged(newSize);
        var newPosition = this.snapItemPositionToGrid(item);
        var positionChanged = this.dragPositionChanged(newPosition);
        if (sizeChanged || positionChanged) {
            // Regenerate the grid with the positions from when the drag started
            this.restoreCachedItems();
            this.gridList.generateGrid();
            this.previousDragPosition = newPosition;
            this.previousDragSize = newSize;
            this.gridList.moveAndResize(item, newPosition, { w: newSize[0], h: newSize[1] });
            // Visually update item positions and highlight shape
            this.applyPositionToItems(true);
            this.applySizeToItems();
            this.highlightPositionForItem(item);
            this.refreshLines();
        }
    };
    GridsterService.prototype.onResizeStop = function (item) {
        this.currentElement = undefined;
        this.updateCachedItems();
        this.previousDragSize = null;
        this.removePositionHighlight();
        this.gridsterComponent.isResizing = false;
        this.gridList.pullItemsToLeft(item);
        this.debounceRenderSubject.next();
        this.fixItemsPositions();
    };
    GridsterService.prototype.onStart = function (item) {
        this.currentElement = item.$element;
        // itemCtrl.isDragging = true;
        // Create a deep copy of the items; we use them to revert the item
        // positions after each drag change, making an entire drag operation less
        // distructable
        this.copyItems();
        // Since dragging actually alters the grid, we need to establish the number
        // of cols (+1 extra) before the drag starts
        this._maxGridCols = this.gridList.grid.length;
        this.gridsterComponent.isDragging = true;
        this.gridsterComponent.updateGridsterElementData();
        this.refreshLines();
    };
    GridsterService.prototype.onDrag = function (item) {
        var newPosition = this.snapItemPositionToGrid(item);
        if (this.dragPositionChanged(newPosition)) {
            // Regenerate the grid with the positions from when the drag started
            this.restoreCachedItems();
            this.gridList.generateGrid();
            this.previousDragPosition = newPosition;
            if (this.options.direction === 'none' &&
                !this.gridList.checkItemAboveEmptyArea(item, { x: newPosition[0], y: newPosition[1] })) {
                return;
            }
            // Since the items list is a deep copy, we need to fetch the item
            // corresponding to this drag action again
            this.gridList.moveItemToPosition(item, newPosition);
            // Visually update item positions and highlight shape
            this.applyPositionToItems(true);
            this.highlightPositionForItem(item);
        }
    };
    GridsterService.prototype.cancel = function () {
        this.restoreCachedItems();
        this.previousDragPosition = null;
        this.updateMaxItemSize();
        this.applyPositionToItems();
        this.removePositionHighlight();
        this.currentElement = undefined;
        this.gridsterComponent.isDragging = false;
    };
    GridsterService.prototype.onDragOut = function (item) {
        this.cancel();
        var idx = this.items.indexOf(item);
        if (idx >= 0) {
            this.items.splice(idx, 1);
        }
        this.gridList.pullItemsToLeft();
        this.render();
    };
    GridsterService.prototype.onStop = function (item) {
        this.currentElement = undefined;
        this.updateCachedItems();
        this.previousDragPosition = null;
        this.removePositionHighlight();
        this.gridList.pullItemsToLeft(item);
        this.gridsterComponent.isDragging = false;
        this.refreshLines();
    };
    GridsterService.prototype.calculateCellSize = function () {
        if (this.options.direction === 'horizontal') {
            this.cellHeight = this.calculateCellHeight();
            this.cellWidth = this.options.cellWidth || this.cellHeight * this.options.widthHeightRatio;
        }
        else {
            this.cellWidth = this.calculateCellWidth();
            this.cellHeight = this.options.cellHeight || this.cellWidth / this.options.widthHeightRatio;
        }
        if (this.options.heightToFontSizeRatio) {
            this._fontSize = this.cellHeight * this.options.heightToFontSizeRatio;
        }
    };
    GridsterService.prototype.applyPositionToItems = function (increaseGridsterSize) {
        if (!this.options.shrink) {
            increaseGridsterSize = true;
        }
        // TODO: Implement group separators
        for (var i = 0; i < this.items.length; i++) {
            // Don't interfere with the positions of the dragged items
            if (this.isCurrentElement(this.items[i].$element)) {
                continue;
            }
            this.items[i].applyPosition(this);
        }
        var child = this.gridsterComponent.$element.firstChild;
        // Update the width of the entire grid container with enough room on the
        // right to allow dragging items to the end of the grid.
        if (this.options.direction === 'horizontal') {
            var increaseWidthWith = (increaseGridsterSize) ? this.maxItemWidth : 0;
            child.style.height = '';
            child.style.width = ((this.gridList.grid.length + increaseWidthWith) * this.cellWidth) + 'px';
        }
        else if (this.gridList.grid.length) {
            // todo: fix me
            var rowHeights = this.getRowHeights();
            var rowTops = this.getRowTops(rowHeights);
            var height = rowTops[rowTops.length - 1] + rowHeights[rowHeights.length - 1];
            var previousHeight = child.style.height;
            child.style.height = height + 'px';
            child.style.width = '';
            if (previousHeight !== child.style.height) {
                this.refreshLines();
            }
        }
    };
    GridsterService.prototype.getRowHeights = function () {
        var result = [];
        for (var row = 0; row < this.gridList.grid.length; row++) {
            result.push(0);
            for (var column = 0; column < this.gridList.grid[row].length; column++) {
                var item = this.gridList.grid[row][column];
                if (item) {
                    var height = item.contentHeight / item.h;
                    if (item.variableHeight && height > result[row]) {
                        result[row] = height;
                    }
                }
            }
            if (result[row] === 0) {
                result[row] = this.cellHeight;
            }
        }
        return result;
    };
    GridsterService.prototype.getRowTops = function (rowHeights) {
        var result = [];
        var lastHeight = 0;
        for (var _i = 0, rowHeights_1 = rowHeights; _i < rowHeights_1.length; _i++) {
            var rowHeight = rowHeights_1[_i];
            result.push(lastHeight);
            lastHeight += rowHeight;
        }
        return result;
    };
    GridsterService.prototype.refreshLines = function () {
        var canvas = this.gridsterComponent.$backgroundGrid.nativeElement;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        var canvasContext = canvas.getContext('2d');
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        if (this.options.lines && this.options.lines.visible &&
            (this.gridsterComponent.isDragging || this.gridsterComponent.isResizing || this.options.lines.always)) {
            var linesColor = this.options.lines.color || '#d8d8d8';
            var linesBgColor = this.options.lines.backgroundColor || 'transparent';
            var linesWidth = this.options.lines.width || 1;
            canvasContext.fillStyle = linesBgColor;
            canvasContext.fillRect(0, 0, canvas.width, canvas.height);
            canvasContext.strokeStyle = linesColor;
            canvasContext.lineWidth = linesWidth;
            canvasContext.beginPath();
            // draw row lines
            var rowHeights = this.getRowHeights();
            var rowTops = this.getRowTops(rowHeights);
            for (var i = 0; i < rowTops.length; i++) {
                canvasContext.moveTo(0, rowTops[i]);
                canvasContext.lineTo(canvas.width, rowTops[i]);
            }
            // draw column lines
            for (var i = 0; i < this.options.lanes; i++) {
                canvasContext.moveTo(i * this.cellWidth, 0);
                canvasContext.lineTo(i * this.cellWidth, canvas.height);
            }
            canvasContext.stroke();
            canvasContext.closePath();
        }
    };
    GridsterService.prototype.removeItemFromCache = function (item) {
        var _this = this;
        this._items = this._items
            .filter(function (cachedItem) { return cachedItem.$element !== item.$element; });
        Object.keys(this._itemsMap)
            .forEach(function (breakpoint) {
            _this._itemsMap[breakpoint] = _this._itemsMap[breakpoint]
                .filter(function (cachedItem) { return cachedItem.$element !== item.$element; });
        });
    };
    GridsterService.prototype.copyItems = function () {
        var _this = this;
        this._items = this.items
            .filter(function (item) { return _this.isValidGridItem(item); })
            .map(function (item) {
            return item.copyForBreakpoint(null);
        });
        this.gridsterOptions.responsiveOptions.forEach(function (options) {
            _this._itemsMap[options.breakpoint] = _this.items
                .filter(function (item) { return _this.isValidGridItem(item); })
                .map(function (item) {
                return item.copyForBreakpoint(options.breakpoint);
            });
        });
    };
    /**
     * Update maxItemWidth and maxItemHeight vales according to current state of items
     */
    GridsterService.prototype.updateMaxItemSize = function () {
        this.maxItemWidth = Math.max.apply(null, this.items.map(function (item) {
            return item.w;
        }));
        this.maxItemHeight = Math.max.apply(null, this.items.map(function (item) {
            return item.h;
        }));
    };
    /**
     * Update items properties of previously cached items
     */
    GridsterService.prototype.restoreCachedItems = function () {
        var _this = this;
        var items = this.options.breakpoint ? this._itemsMap[this.options.breakpoint] : this._items;
        this.items
            .filter(function (item) { return _this.isValidGridItem(item); })
            .forEach(function (item) {
            var cachedItem = items.filter(function (cachedItm) {
                return cachedItm.$element === item.$element;
            })[0];
            item.x = cachedItem.x;
            item.y = cachedItem.y;
            item.w = cachedItem.w;
            item.h = cachedItem.h;
            item.autoSize = cachedItem.autoSize;
        });
    };
    /**
     * If item should react on grid
     * @param GridListItem item
     * @returns boolean
     */
    GridsterService.prototype.isValidGridItem = function (item) {
        if (this.options.direction === 'none') {
            return !!item.itemComponent;
        }
        return true;
    };
    GridsterService.prototype.calculateCellWidth = function () {
        var gridsterWidth = parseFloat(window.getComputedStyle(this.gridsterComponent.$element).width);
        return Math.floor(gridsterWidth / this.options.lanes);
    };
    GridsterService.prototype.calculateCellHeight = function () {
        var gridsterHeight = parseFloat(window.getComputedStyle(this.gridsterComponent.$element).height);
        return Math.floor(gridsterHeight / this.options.lanes);
    };
    GridsterService.prototype.applySizeToItems = function () {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].applySize();
            if (this.options.heightToFontSizeRatio) {
                this.items[i].$element.style['font-size'] = this._fontSize;
            }
        }
    };
    GridsterService.prototype.isCurrentElement = function (element) {
        if (!this.currentElement) {
            return false;
        }
        return element === this.currentElement;
    };
    GridsterService.prototype.snapItemSizeToGrid = function (item) {
        var itemSize = {
            width: parseInt(item.$element.style.width, 10) - 1,
            height: parseInt(item.$element.style.height, 10) - 1
        };
        var colSize = Math.round(itemSize.width / this.cellWidth);
        var rowSize = Math.round(itemSize.height / this.cellHeight);
        // Keep item minimum 1
        colSize = Math.max(colSize, 1);
        rowSize = Math.max(rowSize, 1);
        // check if element is pinned
        if (this.gridList.isOverFixedArea(item.x, item.y, colSize, rowSize, item)) {
            return [item.w, item.h];
        }
        return [colSize, rowSize];
    };
    GridsterService.prototype.generateItemPosition = function (item) {
        var position;
        if (item.itemPrototype) {
            var coords = item.itemPrototype.getPositionToGridster(this);
            position = {
                x: Math.round(coords.x / this.cellWidth),
                y: Math.round(coords.y / this.cellHeight)
            };
        }
        else {
            position = {
                x: Math.round(item.positionX / this.cellWidth),
                y: Math.round(item.positionY / this.cellHeight)
            };
        }
        return position;
    };
    GridsterService.prototype.snapItemPositionToGrid = function (item) {
        var position = this.generateItemPosition(item);
        var col = position.x;
        var row = position.y;
        // Keep item position within the grid and don't let the item create more
        // than one extra column
        col = Math.max(col, 0);
        row = Math.max(row, 0);
        if (this.options.direction === 'horizontal') {
            col = Math.min(col, this._maxGridCols);
        }
        else {
            col = Math.min(col, Math.max(0, this.options.lanes - item.w));
        }
        // check if element is pinned
        if (this.gridList.isOverFixedArea(col, row, item.w, item.h)) {
            return [item.x, item.y];
        }
        return [col, row];
    };
    GridsterService.prototype.dragSizeChanged = function (newSize) {
        if (!this.previousDragSize) {
            return true;
        }
        return (newSize[0] !== this.previousDragSize[0] ||
            newSize[1] !== this.previousDragSize[1]);
    };
    GridsterService.prototype.dragPositionChanged = function (newPosition) {
        if (!this.previousDragPosition) {
            return true;
        }
        return (newPosition[0] !== this.previousDragPosition[0] ||
            newPosition[1] !== this.previousDragPosition[1]);
    };
    GridsterService.prototype.highlightPositionForItem = function (item) {
        var size = item.calculateSize(this);
        var position = item.calculatePosition(this);
        this.$positionHighlight.style.width = size.width + 'px';
        this.$positionHighlight.style.height = size.height + 'px';
        this.$positionHighlight.style.left = position.left + 'px';
        this.$positionHighlight.style.top = position.top + 'px';
        this.$positionHighlight.style.display = '';
        if (this.options.heightToFontSizeRatio) {
            this.$positionHighlight.style['font-size'] = this._fontSize;
        }
    };
    GridsterService.prototype.updateCachedItems = function () {
        var _this = this;
        // Notify the user with the items that changed since the previous snapshot
        this.triggerOnChange(null);
        this.gridsterOptions.responsiveOptions.forEach(function (options) {
            _this.triggerOnChange(options.breakpoint);
        });
        this.copyItems();
    };
    GridsterService.prototype.triggerOnChange = function (breakpoint) {
        var items = breakpoint ? this._itemsMap[breakpoint] : this._items;
        var changeItems = this.gridList.getChangedItems(items || [], breakpoint);
        changeItems
            .filter(function (itemChange) {
            return itemChange.item.itemComponent;
        })
            .forEach(function (itemChange) {
            if (itemChange.changes.indexOf('x') >= 0) {
                itemChange.item.triggerChangeX(breakpoint);
            }
            if (itemChange.changes.indexOf('y') >= 0) {
                itemChange.item.triggerChangeY(breakpoint);
            }
            if (itemChange.changes.indexOf('w') >= 0) {
                itemChange.item.triggerChangeW(breakpoint);
            }
            if (itemChange.changes.indexOf('h') >= 0) {
                itemChange.item.triggerChangeH(breakpoint);
            }
            // should be called only once (not for each breakpoint)
            itemChange.item.itemComponent.change.emit({
                item: itemChange.item,
                oldValues: itemChange.oldValues || {},
                isNew: itemChange.isNew,
                changes: itemChange.changes,
                breakpoint: breakpoint
            });
        });
    };
    GridsterService.prototype.removePositionHighlight = function () {
        this.$positionHighlight.style.display = 'none';
    };
    GridsterService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [])
    ], GridsterService);
    return GridsterService;
}());
export { GridsterService };
//# sourceMappingURL=gridster.service.js.map