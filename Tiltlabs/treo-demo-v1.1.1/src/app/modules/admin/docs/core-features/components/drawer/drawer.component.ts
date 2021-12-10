import { Component } from '@angular/core';
import { TreoDrawerMode, TreoDrawerService } from '@treo/components/drawer';

@Component({
    selector   : 'drawer',
    templateUrl: './drawer.component.html',
    styles     : ['']
})
export class DrawerComponent
{
    drawerMode: TreoDrawerMode;

    /**
     * Constructor
     *
     * @param {TreoDrawerService} _treoDrawerService
     */
    constructor(
        private _treoDrawerService: TreoDrawerService
    )
    {
        // Set the defaults
        this.drawerMode = 'side';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle the drawer mode
     *
     * @param drawerName
     */
    toggleDrawerMode(drawerName): void
    {
        const drawer = this._treoDrawerService.getComponent(drawerName);
        drawer.mode = drawer.mode === 'side' ? 'over' : 'side';
    }

    /**
     * Toggle the drawer open
     *
     * @param drawerName
     */
    toggleDrawerOpen(drawerName): void
    {
        const drawer = this._treoDrawerService.getComponent(drawerName);
        drawer.toggle();
    }
}
