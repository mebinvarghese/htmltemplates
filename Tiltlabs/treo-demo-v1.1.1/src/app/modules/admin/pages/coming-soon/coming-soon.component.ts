import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TreoAnimations } from '@treo/animations';

@Component({
    selector     : 'coming-soon',
    templateUrl  : './coming-soon.component.html',
    styleUrls    : ['./coming-soon.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : TreoAnimations
})
export class ComingSoonComponent implements OnInit
{
    cardStyle: string;
    comingSoonForm: FormGroup;
    message: any;

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
        // Create the form
        this.comingSoonForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
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
     * Register
     */
    register(): void
    {
        // Do nothing if the form is invalid
        if ( this.comingSoonForm.invalid )
        {
            return;
        }

        // Disable the form
        this.comingSoonForm.disable();

        // Hide the message
        this.message = null;

        // Do your action here...

        // Emulate server delay
        setTimeout(() => {

            // Re-enable the form
            this.comingSoonForm.enable();

            // Reset the form
            this.comingSoonForm.reset({});

            // Show the message
            this.message = {
                type   : 'success',
                content: 'You have been registered to the list.',
                shake  : false
            };
        }, 1000);
    }
}
