import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'contacts',
    templateUrl    : './contacts.component.html',
    styleUrls      : ['./contacts.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
