import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
    selector   : 'helpers',
    templateUrl: './helpers.component.html',
    styles     : ['']
})
export class HelpersComponent
{
    formFieldHelpers: string[];

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder
    )
    {
        // Set the default
        this.formFieldHelpers = [''];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the form field helpers as string
     */
    getFormFieldHelpersAsString(): string
    {
        return this.formFieldHelpers.join(' ');
    }
}
