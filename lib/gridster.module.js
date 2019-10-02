import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridsterComponent } from './gridster.component';
import { GridsterItemComponent } from './gridster-item/gridster-item.component';
import { GridsterItemPrototypeDirective } from './gridster-prototype/gridster-item-prototype.directive';
import { GridsterPrototypeService } from './gridster-prototype/gridster-prototype.service';
var GridsterModule = /** @class */ (function () {
    function GridsterModule() {
    }
    GridsterModule_1 = GridsterModule;
    GridsterModule.forRoot = function () {
        return {
            ngModule: GridsterModule_1,
            providers: [GridsterPrototypeService]
        };
    };
    GridsterModule = GridsterModule_1 = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule
            ],
            declarations: [
                GridsterComponent,
                GridsterItemComponent,
                GridsterItemPrototypeDirective
            ],
            exports: [
                GridsterComponent,
                GridsterItemComponent,
                GridsterItemPrototypeDirective
            ]
        })
    ], GridsterModule);
    return GridsterModule;
    var GridsterModule_1;
}());
export { GridsterModule };
//# sourceMappingURL=gridster.module.js.map