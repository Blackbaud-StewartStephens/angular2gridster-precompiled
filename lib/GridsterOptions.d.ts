import { Observable } from 'rxjs';
import { IGridsterOptions } from './IGridsterOptions';
export declare class GridsterOptions {
    direction: string;
    lanes: number;
    widthHeightRatio: number;
    heightToFontSizeRatio: number;
    responsiveView: boolean;
    responsiveSizes: boolean;
    dragAndDrop: boolean;
    resizable: boolean;
    shrink: boolean;
    minWidth: number;
    useCSSTransforms: boolean;
    defaults: IGridsterOptions;
    change: Observable<IGridsterOptions>;
    responsiveOptions: Array<IGridsterOptions>;
    basicOptions: IGridsterOptions;
    breakpointsMap: {
        [index: string]: number;
    };
    constructor(config: IGridsterOptions);
    getOptionsByWidth(width: number): IGridsterOptions;
    private extendResponsiveOptions(responsiveOptions);
}
