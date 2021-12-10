import { Component, ViewEncapsulation } from '@angular/core';
import { TreoAnimations } from '@treo/animations';

@Component({
    selector     : 'colors',
    templateUrl  : './colors.component.html',
    styleUrls    : ['./colors.component.scss'],
    animations   : TreoAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ColorsComponent
{
    treoPalettes: any[];
    themePalettes: any[];
    hues: any[];

    /**
     * Constructor
     */
    constructor()
    {
        // Set the defaults
        this.themePalettes = [
            'primary',
            'accent',
            'warn',
            'white',
            'black'
        ];
        this.treoPalettes = [
            'gray',
            'cool-gray',
            'red',
            'orange',
            'yellow',
            'green',
            'teal',
            'blue',
            'indigo',
            'purple',
            'pink'
        ];
        this.hues = ['900', '800', '700', '600', '500', '400', '300', '200', '100', '50'];
    }
}
