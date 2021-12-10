import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'inventory',
    templateUrl    : './inventory.component.html',
    styleUrls      : ['./inventory.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
