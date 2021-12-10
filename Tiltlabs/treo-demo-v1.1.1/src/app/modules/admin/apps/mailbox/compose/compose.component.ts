import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector     : 'mailbox-compose',
    templateUrl  : './compose.component.html',
    styleUrls    : ['./compose.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MailboxComposeComponent implements OnInit
{
    composeForm: FormGroup;
    copyFields: { cc: boolean, bcc: boolean };
    quillModules: any;

    /**
     * Constructor
     *
     * @param {MatDialogRef} matDialogRef
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private _formBuilder: FormBuilder
    )
    {
        // Set the default
        this.copyFields = {
            cc : false,
            bcc: false
        };

        this.quillModules = {
            toolbar: [
                [{font: []}],
                [{size: ['small', false, 'large', 'huge']}],
                ['bold', 'italic', 'underline'],
                [{color: []}, {background: []}],
                [{align: []}],
                [{list: 'ordered'}, {list: 'bullet'}],
                [{indent: '-1'}, {indent: '+1'}],
                ['blockquote', 'code-block', 'strike'],
                ['clean']
            ]
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.composeForm = this._formBuilder.group({
            to     : ['', [Validators.required, Validators.email]],
            cc     : ['', [Validators.email]],
            bcc    : ['', [Validators.email]],
            subject: [''],
            body   : ['', [Validators.required]]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Show the copy field with the given field name
     *
     * @param name
     */
    showCopyField(name: string): void
    {
        // Return, if the name is not one of the available names
        if ( name !== 'cc' && name !== 'bcc' )
        {
            return;
        }

        // Show the field
        this.copyFields[name] = true;
    }

    /**
     * Save and close
     */
    saveAndClose(): void
    {
        // Save the message as a draft
        this.saveAsDraft();

        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Discard the message
     */
    discard(): void
    {

    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void
    {

    }

    /**
     * Send the message
     */
    send(): void
    {

    }
}
