import { Component } from '@angular/core';
import { TreoMessageService } from '@treo/components/message';

@Component({
    selector   : 'messages',
    templateUrl: './message.component.html',
    styles     : ['']
})
export class MessageComponent
{
    /**
     * Constructor
     *
     * @param {TreoMessageService} _treoMessageService
     */
    constructor(
        private _treoMessageService: TreoMessageService
    )
    {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Dismiss a message box via the service
     *
     * @param name
     */
    dismiss(name): void
    {
        // Dismiss
        this._treoMessageService.dismiss(name);
    }

    /**
     * Show a message box via the service
     *
     * @param name
     */
    show(name): void
    {
        // Show
        this._treoMessageService.show(name);
    }

}
