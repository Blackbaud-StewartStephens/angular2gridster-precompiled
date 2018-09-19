import * as tslib_1 from "tslib";
import { Component, ElementRef, ViewChild, NgZone, Input, Output, EventEmitter, ChangeDetectionStrategy, HostBinding, ViewEncapsulation } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, filter, publish } from 'rxjs/operators';
import { utils } from './utils/utils';
import { GridsterService } from './gridster.service';
import { GridsterPrototypeService } from './gridster-prototype/gridster-prototype.service';
import { GridsterOptions } from './GridsterOptions';
var GridsterComponent = /** @class */ (function () {
    function GridsterComponent(zone, elementRef, gridster, gridsterPrototype) {
        this.zone = zone;
        this.gridsterPrototype = gridsterPrototype;
        this.optionsChange = new EventEmitter();
        this.ready = new EventEmitter();
        this.reflow = new EventEmitter();
        this.prototypeDrop = new EventEmitter();
        this.prototypeEnter = new EventEmitter();
        this.prototypeOut = new EventEmitter();
        this.isDragging = false;
        this.isResizing = false;
        this.isReady = false;
        this.isPrototypeEntered = false;
        this.isDisabled = false;
        this.subscription = new Subscription();
        this.gridster = gridster;
        this.$element = elementRef.nativeElement;
    }
    GridsterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.gridsterOptions = new GridsterOptions(this.options);
        if (this.options.useCSSTransforms) {
            this.$element.classList.add('css-transform');
        }
        this.subscription.add(this.gridsterOptions.change.subscribe(function (options) {
            _this.gridster.options = options;
            if (_this.gridster.gridList) {
                _this.gridster.gridList.options = options;
            }
            _this.optionsChange.emit(options);
        }));
        this.gridster.init(this);
        this.subscription.add(Observable.fromEvent(window, 'resize').pipe(debounceTime(this.gridster.options.responsiveDebounce || 0), filter(function () { return _this.gridster.options.responsiveView; })).subscribe(function () { return _this.reload(); }));
        this.zone.runOutsideAngular(function () {
            _this.subscription.add(Observable.fromEvent(document, 'scroll', { passive: true }).subscribe(function () { return _this.updateGridsterElementData(); }));
        });
    };
    GridsterComponent.prototype.ngAfterContentInit = function () {
        this.gridster.start();
        this.updateGridsterElementData();
        this.connectGridsterPrototype();
        this.gridster.$positionHighlight = this.$positionHighlight.nativeElement;
    };
    GridsterComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    /**
     * Change gridster config option and rebuild
     * @param string name
     * @param any value
     * @return GridsterComponent
     */
    GridsterComponent.prototype.setOption = function (name, value) {
        if (name === 'dragAndDrop') {
            if (value) {
                this.enableDraggable();
            }
            else {
                this.disableDraggable();
            }
        }
        if (name === 'resizable') {
            if (value) {
                this.enableResizable();
            }
            else {
                this.disableResizable();
            }
        }
        if (name === 'lanes') {
            this.gridster.options.lanes = value;
            this.gridster.gridList.fixItemsPositions(this.gridster.options);
            this.reflowGridster();
        }
        if (name === 'direction') {
            this.gridster.options.direction = value;
            this.gridster.gridList.pullItemsToLeft();
        }
        if (name === 'widthHeightRatio') {
            this.gridster.options.widthHeightRatio = parseFloat(value || 1);
        }
        if (name === 'responsiveView') {
            this.gridster.options.responsiveView = !!value;
        }
        this.gridster.gridList.setOption(name, value);
        return this;
    };
    GridsterComponent.prototype.reload = function () {
        var _this = this;
        setTimeout(function () {
            _this.gridster.fixItemsPositions();
            _this.reflowGridster();
        });
        return this;
    };
    GridsterComponent.prototype.reflowGridster = function (isInit) {
        if (isInit === void 0) { isInit = false; }
        this.gridster.reflow();
        this.reflow.emit({
            isInit: isInit,
            gridsterComponent: this
        });
    };
    GridsterComponent.prototype.updateGridsterElementData = function () {
        this.gridster.gridsterScrollData = this.getScrollPositionFromParents(this.$element);
        this.gridster.gridsterRect = this.$element.getBoundingClientRect();
    };
    GridsterComponent.prototype.setReady = function () {
        var _this = this;
        setTimeout(function () { return _this.isReady = true; });
        this.ready.emit();
    };
    GridsterComponent.prototype.adjustItemsHeightToContent = function (scrollableItemElementSelector) {
        var _this = this;
        if (scrollableItemElementSelector === void 0) { scrollableItemElementSelector = '.gridster-item-inner'; }
        this.gridster.items
            .map(function (item) {
            var scrollEl = item.$element.querySelector(scrollableItemElementSelector);
            var contentEl = scrollEl.lastElementChild;
            var scrollElDistance = utils.getRelativeCoordinates(scrollEl, item.$element);
            var scrollElRect = scrollEl.getBoundingClientRect();
            var contentRect = contentEl.getBoundingClientRect();
            return {
                item: item,
                contentHeight: contentRect.bottom - scrollElRect.top,
                scrollElDistance: scrollElDistance
            };
        })
            .forEach(function (data) {
            data.item.h = Math.ceil(((data.contentHeight) / (_this.gridster.cellHeight - data.scrollElDistance.top)));
        });
        this.gridster.fixItemsPositions();
        this.gridster.reflow();
    };
    GridsterComponent.prototype.disable = function (item) {
        var itemIdx = this.gridster.items.indexOf(item.itemComponent);
        this.isDisabled = true;
        if (itemIdx >= 0) {
            delete this.gridster.items[this.gridster.items.indexOf(item.itemComponent)];
        }
        this.gridster.onDragOut(item);
    };
    GridsterComponent.prototype.enable = function () {
        this.isDisabled = false;
    };
    GridsterComponent.prototype.getScrollPositionFromParents = function (element, data) {
        if (data === void 0) { data = { scrollTop: 0, scrollLeft: 0 }; }
        if (element.parentElement && element.parentElement !== document.body) {
            data.scrollTop += element.parentElement.scrollTop;
            data.scrollLeft += element.parentElement.scrollLeft;
            return this.getScrollPositionFromParents(element.parentElement, data);
        }
        return {
            scrollTop: data.scrollTop,
            scrollLeft: data.scrollLeft
        };
    };
    /**
     * Connect gridster prototype item to gridster dragging hooks (onStart, onDrag, onStop).
     */
    GridsterComponent.prototype.connectGridsterPrototype = function () {
        var _this = this;
        this.gridsterPrototype.observeDropOut(this.gridster).subscribe();
        var dropOverObservable = this.gridsterPrototype.observeDropOver(this.gridster).pipe(publish());
        var dragObservable = this.gridsterPrototype.observeDragOver(this.gridster);
        dragObservable.dragOver.pipe(filter(function () { return !_this.isDisabled; })).subscribe(function (prototype) {
            if (!_this.isPrototypeEntered) {
                return;
            }
            _this.gridster.onDrag(prototype.item);
        });
        dragObservable.dragEnter.pipe(filter(function () { return !_this.isDisabled; })).subscribe(function (prototype) {
            _this.isPrototypeEntered = true;
            if (_this.gridster.items.indexOf(prototype.item) < 0) {
                _this.gridster.items.push(prototype.item);
            }
            _this.gridster.onStart(prototype.item);
            prototype.setDragContextGridster(_this.gridster);
            if (_this.parent) {
                _this.parent.disable(prototype.item);
            }
            _this.prototypeEnter.emit({ item: prototype.item });
        });
        dragObservable.dragOut.pipe(filter(function () { return !_this.isDisabled; })).subscribe(function (prototype) {
            if (!_this.isPrototypeEntered) {
                return;
            }
            _this.gridster.onDragOut(prototype.item);
            _this.isPrototypeEntered = false;
            _this.prototypeOut.emit({ item: prototype.item });
            if (_this.parent) {
                _this.parent.enable();
                _this.parent.isPrototypeEntered = true;
                if (_this.parent.gridster.items.indexOf(prototype.item) < 0) {
                    _this.parent.gridster.items.push(prototype.item);
                }
                _this.parent.gridster.onStart(prototype.item);
                prototype.setDragContextGridster(_this.parent.gridster);
                // timeout is needed to be sure that "enter" event is fired after "out"
                setTimeout(function () {
                    _this.parent.prototypeEnter.emit({ item: prototype.item });
                    prototype.onEnter(_this.parent.gridster);
                });
            }
        });
        dropOverObservable.pipe(filter(function () { return !_this.isDisabled; })).subscribe(function (data) {
            if (!_this.isPrototypeEntered) {
                return;
            }
            _this.gridster.onStop(data.item.item);
            _this.gridster.removeItem(data.item.item);
            _this.isPrototypeEntered = false;
            if (_this.parent) {
                _this.parent.enable();
            }
            _this.prototypeDrop.emit({ item: data.item.item });
        });
        dropOverObservable.connect();
    };
    GridsterComponent.prototype.enableDraggable = function () {
        this.gridster.options.dragAndDrop = true;
        this.gridster.items
            .filter(function (item) { return item.itemComponent && item.itemComponent.dragAndDrop; })
            .forEach(function (item) { return item.itemComponent.enableDragDrop(); });
    };
    GridsterComponent.prototype.disableDraggable = function () {
        this.gridster.options.dragAndDrop = false;
        this.gridster.items
            .filter(function (item) { return item.itemComponent; })
            .forEach(function (item) { return item.itemComponent.disableDraggable(); });
    };
    GridsterComponent.prototype.enableResizable = function () {
        this.gridster.options.resizable = true;
        this.gridster.items
            .filter(function (item) { return item.itemComponent && item.itemComponent.resizable; })
            .forEach(function (item) { return item.itemComponent.enableResizable(); });
    };
    GridsterComponent.prototype.disableResizable = function () {
        this.gridster.options.resizable = false;
        this.gridster.items.forEach(function (item) { return item.itemComponent.disableResizable(); });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterComponent.prototype, "options", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterComponent.prototype, "optionsChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterComponent.prototype, "ready", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterComponent.prototype, "reflow", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterComponent.prototype, "prototypeDrop", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterComponent.prototype, "prototypeEnter", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterComponent.prototype, "prototypeOut", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], GridsterComponent.prototype, "draggableOptions", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", GridsterComponent)
    ], GridsterComponent.prototype, "parent", void 0);
    tslib_1.__decorate([
        ViewChild('positionHighlight'),
        tslib_1.__metadata("design:type", Object)
    ], GridsterComponent.prototype, "$positionHighlight", void 0);
    tslib_1.__decorate([
        ViewChild('backgroundGrid'),
        tslib_1.__metadata("design:type", Object)
    ], GridsterComponent.prototype, "$backgroundGrid", void 0);
    tslib_1.__decorate([
        HostBinding('class.gridster--dragging'),
        tslib_1.__metadata("design:type", Object)
    ], GridsterComponent.prototype, "isDragging", void 0);
    tslib_1.__decorate([
        HostBinding('class.gridster--resizing'),
        tslib_1.__metadata("design:type", Object)
    ], GridsterComponent.prototype, "isResizing", void 0);
    tslib_1.__decorate([
        HostBinding('class.gridster--ready'),
        tslib_1.__metadata("design:type", Object)
    ], GridsterComponent.prototype, "isReady", void 0);
    GridsterComponent = tslib_1.__decorate([
        Component({
            selector: 'ngx-gridster',
            template: "<div class=\"gridster-container\">\n      <canvas class=\"gridster-background-grid\" #backgroundGrid></canvas>\n      <ng-content></ng-content>\n      <div class=\"position-highlight\" style=\"display:none;\" #positionHighlight>\n        <div class=\"inner\"></div>\n      </div>\n    </div>",
            styles: ["\n    ngx-gridster {\n        position: relative;\n        display: block;\n        left: 0;\n        width: 100%;\n    }\n\n    ngx-gridster.gridster--dragging {\n        -moz-user-select: none;\n        -khtml-user-select: none;\n        -webkit-user-select: none;\n        -ms-user-select: none;\n        user-select: none;\n    }\n\n    ngx-gridster .gridster-container {\n        position: relative;\n        width: 100%;\n        list-style: none;\n        -webkit-transition: width 0.2s, height 0.2s;\n        transition: width 0.2s, height 0.2s;\n    }\n\n    ngx-gridster .position-highlight {\n        display: block;\n        position: absolute;\n        z-index: 1;\n    }\n\n    ngx-gridster .gridster-background-grid {\n        z-index: 0;\n        position: relative;\n        width: 100%;\n        height: 100%\n    }\n    "],
            providers: [GridsterService],
            changeDetection: ChangeDetectionStrategy.OnPush,
            encapsulation: ViewEncapsulation.None
        }),
        tslib_1.__metadata("design:paramtypes", [NgZone,
            ElementRef, GridsterService,
            GridsterPrototypeService])
    ], GridsterComponent);
    return GridsterComponent;
}());
export { GridsterComponent };
//# sourceMappingURL=gridster.component.js.map