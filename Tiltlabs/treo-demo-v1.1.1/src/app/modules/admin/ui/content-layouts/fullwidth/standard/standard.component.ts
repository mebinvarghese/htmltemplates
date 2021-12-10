import { Component } from '@angular/core';

@Component({
    selector   : 'fullwidth-standard',
    templateUrl: './standard.component.html',
    styleUrls  : ['./standard.component.scss']
})
export class FullwidthStandardComponent
{
    scrollMode: string;

    /**
     * Constructor
     */
    constructor()
    {
        // Set the defaults
        this.scrollMode = 'normal';
    }
}
