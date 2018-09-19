var GridListItem = /** @class */ (function () {
    function GridListItem() {
    }
    Object.defineProperty(GridListItem.prototype, "$element", {
        get: function () {
            return this.getItem().$element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "x", {
        get: function () {
            var item = this.getItem();
            var breakpoint = item.gridster ? item.gridster.options.breakpoint : null;
            return this.getValueX(breakpoint);
        },
        set: function (value) {
            var item = this.getItem();
            var breakpoint = item.gridster ? item.gridster.options.breakpoint : null;
            this.setValueX(value, breakpoint);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "y", {
        get: function () {
            var item = this.getItem();
            var breakpoint = item.gridster ? item.gridster.options.breakpoint : null;
            return this.getValueY(breakpoint);
        },
        set: function (value) {
            var item = this.getItem();
            var breakpoint = item.gridster ? item.gridster.options.breakpoint : null;
            this.setValueY(value, breakpoint);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "w", {
        get: function () {
            var item = this.getItem();
            var breakpoint = item.gridster ? item.gridster.options.breakpoint : null;
            return this.getValueW(breakpoint);
        },
        set: function (value) {
            var item = this.getItem();
            var breakpoint = item.gridster ? item.gridster.options.breakpoint : null;
            this.setValueW(value, breakpoint);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "h", {
        get: function () {
            var item = this.getItem();
            var breakpoint = item.gridster ? item.gridster.options.breakpoint : null;
            return this.getValueH(breakpoint);
        },
        set: function (value) {
            var item = this.getItem();
            var breakpoint = item.gridster ? item.gridster.options.breakpoint : null;
            this.setValueH(value, breakpoint);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "autoSize", {
        get: function () {
            return this.getItem().autoSize;
        },
        set: function (value) {
            this.getItem().autoSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "dragAndDrop", {
        get: function () {
            return !!this.getItem().dragAndDrop;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "resizable", {
        get: function () {
            return !!this.getItem().resizable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "positionX", {
        get: function () {
            var item = this.itemComponent || this.itemPrototype;
            if (!item) {
                return null;
            }
            return item.positionX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "positionY", {
        get: function () {
            var item = this.itemComponent || this.itemPrototype;
            if (!item) {
                return null;
            }
            return item.positionY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "variableHeight", {
        get: function () {
            return this.getItem().variableHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "contentHeight", {
        get: function () {
            var contentHeight = this.itemComponent.contentWrapper.nativeElement.offsetheight || 0;
            var childHeight = this.$element.firstChild.offsetHeight || 0;
            return Math.max(contentHeight, childHeight);
        },
        enumerable: true,
        configurable: true
    });
    GridListItem.prototype.setFromGridsterItem = function (item) {
        if (this.isItemSet()) {
            throw new Error('GridListItem is already set.');
        }
        this.itemComponent = item;
        return this;
    };
    GridListItem.prototype.setFromGridsterItemPrototype = function (item) {
        if (this.isItemSet()) {
            throw new Error('GridListItem is already set.');
        }
        this.itemPrototype = item;
        return this;
    };
    GridListItem.prototype.setFromObjectLiteral = function (item) {
        if (this.isItemSet()) {
            throw new Error('GridListItem is already set.');
        }
        this.itemObject = item;
        return this;
    };
    GridListItem.prototype.copy = function () {
        var itemCopy = new GridListItem();
        return itemCopy.setFromObjectLiteral({
            $element: this.$element,
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            autoSize: this.autoSize,
            dragAndDrop: this.dragAndDrop,
            resizable: this.resizable
        });
    };
    GridListItem.prototype.copyForBreakpoint = function (breakpoint) {
        var itemCopy = new GridListItem();
        return itemCopy.setFromObjectLiteral({
            $element: this.$element,
            x: this.getValueX(breakpoint),
            y: this.getValueY(breakpoint),
            w: this.getValueW(breakpoint),
            h: this.getValueH(breakpoint),
            autoSize: this.autoSize,
            dragAndDrop: this.dragAndDrop,
            resizable: this.resizable
        });
    };
    GridListItem.prototype.getValueX = function (breakpoint) {
        var item = this.getItem();
        return item[this.getXProperty(breakpoint)];
    };
    GridListItem.prototype.getValueY = function (breakpoint) {
        var item = this.getItem();
        return item[this.getYProperty(breakpoint)];
    };
    GridListItem.prototype.getValueW = function (breakpoint) {
        var item = this.getItem();
        return item[this.getWProperty(breakpoint)] || 1;
    };
    GridListItem.prototype.getValueH = function (breakpoint) {
        var item = this.getItem();
        return item[this.getHProperty(breakpoint)] || 1;
    };
    GridListItem.prototype.setValueX = function (value, breakpoint) {
        var item = this.getItem();
        item[this.getXProperty(breakpoint)] = value;
    };
    GridListItem.prototype.setValueY = function (value, breakpoint) {
        var item = this.getItem();
        item[this.getYProperty(breakpoint)] = value;
    };
    GridListItem.prototype.setValueW = function (value, breakpoint) {
        var item = this.getItem();
        item[this.getWProperty(breakpoint)] = value;
    };
    GridListItem.prototype.setValueH = function (value, breakpoint) {
        var item = this.getItem();
        item[this.getHProperty(breakpoint)] = value;
    };
    GridListItem.prototype.triggerChangeX = function (breakpoint) {
        var item = this.itemComponent;
        if (item) {
            item[this.getXProperty(breakpoint) + 'Change'].emit(this.getValueX(breakpoint));
        }
    };
    GridListItem.prototype.triggerChangeY = function (breakpoint) {
        var item = this.itemComponent;
        if (item) {
            item[this.getYProperty(breakpoint) + 'Change'].emit(this.getValueY(breakpoint));
        }
    };
    GridListItem.prototype.triggerChangeW = function (breakpoint) {
        var item = this.itemComponent;
        if (item) {
            item[this.getWProperty(breakpoint) + 'Change'].emit(this.getValueW(breakpoint));
        }
    };
    GridListItem.prototype.triggerChangeH = function (breakpoint) {
        var item = this.itemComponent;
        if (item) {
            item[this.getHProperty(breakpoint) + 'Change'].emit(this.getValueH(breakpoint));
        }
    };
    GridListItem.prototype.hasPositions = function (breakpoint) {
        var x = this.getValueX(breakpoint);
        var y = this.getValueY(breakpoint);
        return (x || x === 0) && (y || y === 0);
    };
    GridListItem.prototype.applyPosition = function (gridster) {
        var position = this.calculatePosition(gridster);
        this.itemComponent.positionX = position.left;
        this.itemComponent.positionY = position.top;
        this.itemComponent.updateElemenetPosition();
    };
    GridListItem.prototype.calculatePosition = function (gridster) {
        if (!gridster && !this.itemComponent) {
            return { left: 0, top: 0 };
        }
        gridster = gridster || this.itemComponent.gridster;
        var top;
        if (gridster.gridList) {
            var rowHeights = gridster.getRowHeights();
            var rowTops = gridster.getRowTops(rowHeights);
            top = rowTops[this.y];
        }
        else {
            top = this.y * gridster.cellHeight;
        }
        return {
            left: this.x * gridster.cellWidth,
            top: top
        };
    };
    GridListItem.prototype.applySize = function (gridster) {
        var size = this.calculateSize(gridster);
        this.$element.style.width = size.width + 'px';
        this.$element.style.height = size.height + 'px';
    };
    GridListItem.prototype.calculateSize = function (gridster) {
        if (!gridster && !this.itemComponent) {
            return { width: 0, height: 0 };
        }
        gridster = gridster || this.itemComponent.gridster;
        var rowHeights, rowTops;
        if (gridster.gridList) {
            rowHeights = gridster.getRowHeights();
            rowTops = gridster.getRowTops(rowHeights);
        }
        var width = this.w;
        var height = this.h;
        if (gridster.options.direction === 'vertical') {
            width = Math.min(width, gridster.options.lanes);
        }
        if (gridster.options.direction === 'horizontal') {
            height = Math.min(height, gridster.options.lanes);
        }
        var pixelHeight;
        if (rowHeights) {
            pixelHeight = 0;
            for (var i = this.y; i < this.y + height; i++) {
                pixelHeight += rowHeights[i];
            }
        }
        else {
            pixelHeight = height * gridster.cellHeight;
        }
        return {
            width: width * gridster.cellWidth,
            height: pixelHeight
        };
    };
    GridListItem.prototype.getXProperty = function (breakpoint) {
        if (breakpoint && this.itemComponent) {
            return GridListItem.X_PROPERTY_MAP[breakpoint];
        }
        else {
            return 'x';
        }
    };
    GridListItem.prototype.getYProperty = function (breakpoint) {
        if (breakpoint && this.itemComponent) {
            return GridListItem.Y_PROPERTY_MAP[breakpoint];
        }
        else {
            return 'y';
        }
    };
    GridListItem.prototype.getWProperty = function (breakpoint) {
        if (this.itemPrototype) {
            return this.itemPrototype[GridListItem.W_PROPERTY_MAP[breakpoint]] ?
                GridListItem.W_PROPERTY_MAP[breakpoint] : 'w';
        }
        var item = this.getItem();
        var responsiveSizes = item.gridster && item.gridster.options.responsiveSizes;
        if (breakpoint && responsiveSizes) {
            return GridListItem.W_PROPERTY_MAP[breakpoint];
        }
        else {
            return 'w';
        }
    };
    GridListItem.prototype.getHProperty = function (breakpoint) {
        if (this.itemPrototype) {
            return this.itemPrototype[GridListItem.H_PROPERTY_MAP[breakpoint]] ?
                GridListItem.H_PROPERTY_MAP[breakpoint] : 'w';
        }
        var item = this.getItem();
        var responsiveSizes = item.gridster && item.gridster.options.responsiveSizes;
        if (breakpoint && responsiveSizes) {
            return GridListItem.H_PROPERTY_MAP[breakpoint];
        }
        else {
            return 'h';
        }
    };
    GridListItem.prototype.getItem = function () {
        var item = this.itemComponent || this.itemPrototype || this.itemObject;
        if (!item) {
            throw new Error('GridListItem is not set.');
        }
        return item;
    };
    GridListItem.prototype.isItemSet = function () {
        return this.itemComponent || this.itemPrototype || this.itemObject;
    };
    GridListItem.BREAKPOINTS = ['sm', 'md', 'lg', 'xl'];
    GridListItem.X_PROPERTY_MAP = {
        sm: 'xSm',
        md: 'xMd',
        lg: 'xLg',
        xl: 'xXl'
    };
    GridListItem.Y_PROPERTY_MAP = {
        sm: 'ySm',
        md: 'yMd',
        lg: 'yLg',
        xl: 'yXl'
    };
    GridListItem.W_PROPERTY_MAP = {
        sm: 'wSm',
        md: 'wMd',
        lg: 'wLg',
        xl: 'wXl'
    };
    GridListItem.H_PROPERTY_MAP = {
        sm: 'hSm',
        md: 'hMd',
        lg: 'hLg',
        xl: 'hXl'
    };
    return GridListItem;
}());
export { GridListItem };
//# sourceMappingURL=GridListItem.js.map