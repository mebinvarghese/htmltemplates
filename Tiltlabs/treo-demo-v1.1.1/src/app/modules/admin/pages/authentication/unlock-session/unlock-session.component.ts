import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TreoAnimations } from '@treo/animations';

@Component({
    selector     : 'unlock-session',
    templateUrl  : './unlock-session.component.html',
    styleUrls    : ['./unlock-session.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : TreoAnimations
})
export class UnlockSessionComponent implements OnInit
{
    cardStyle: string;
    message: any;
    name: string;
    unlockSessionForm: FormGroup;

    /**
     * Constructor
     *
     * @param {ActivatedRoute} _activatedRoute
     * @param {FormBuilder} _formBuilder
     * @param {Router} _router
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private _router: Router
    )
    {
        // Set the defaults
        this.message = null;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the user's name
        this.name = 'Andrew Watkins';

        // Create the form
        this.unlockSessionForm = this._formBuilder.group({
            name    : [
                {
                    value   : this.name,
                    disabled: true
                }
            ],
            password: ['']
        });

        // Set the card style for the first time
        this._setCardStyle();

        // Register to the NavigationEnd event
        this._router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {

                // Set the card style
                this._setCardStyle();
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the card style from the url
     * Demonstration purposes only!
     *
     * @private
     */
    private _setCardStyle(): void
    {
        // Get the current route
        let route = this._activatedRoute;
        while ( route.firstChild )
        {
            route = route.firstChild;
        }

        // Set the card style from the path
        this.cardStyle = route.snapshot.url[0].path;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Unlock
     */
    unlock(): void
    {
        // Disable the form
        this.unlockSessionForm.disable();

        // Hide the message
        this.message = null;

        // Do your action here...

        // Emulate server delay
        setTimeout(() => {

            // Re-enable the form
            this.unlockSessionForm.enable();

            // Reset the form
            this.unlockSessionForm.reset({
                name: {
                    value   : this.name,
                    disabled: true
                }
            });

            // Show the message
            this.message = {
                appearance: 'outline',
                content   : 'Invalid password',
                shake     : true,
                showIcon  : false,
                type      : 'error'
            };
        }, 1000);
    }
}
