import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'maintenance',
    templateUrl    : './maintenance.component.html',
    styleUrls      : ['./maintenance.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaintenanceComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
