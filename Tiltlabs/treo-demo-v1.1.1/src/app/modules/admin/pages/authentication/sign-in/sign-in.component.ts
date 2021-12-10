import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TreoAnimations } from '@treo/animations';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector     : 'sign-in',
    templateUrl  : './sign-in.component.html',
    styleUrls    : ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : TreoAnimations
})
export class SignInComponent implements OnInit
{
    cardStyle: string;
    signInForm: FormGroup;
    message: any;

    /**
     * Constructor
     *
     * @param {ActivatedRoute} _activatedRoute
     * @param {AuthService} _authService
     * @param {FormBuilder} _formBuilder
     * @param {Router} _router
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
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
        this.signInForm = this._formBuilder.group({
            email     : [''],
            password  : [''],
            rememberMe: ['']
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
     * Sign in
     */
    signIn(): void
    {
        // Disable the form
        this.signInForm.disable();

        // Hide the message
        this.message = null;

        // Do your action here...

        // Emulate server delay
        setTimeout(() => {

            // Re-enable the form
            this.signInForm.enable();

            // Reset the form
            this.signInForm.reset({});

            // Show the message
            this.message = {
                appearance: 'outline',
                content   : 'Invalid email or password',
                shake     : true,
                showIcon  : false,
                type      : 'error'
            };
        }, 1000);
    }
}
