import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TreoAnimations } from '@treo/animations';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector     : 'sign-up',
    templateUrl  : './sign-up.component.html',
    styleUrls    : ['./sign-up.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : TreoAnimations
})
export class SignUpComponent implements OnInit, OnDestroy
{
    cardStyle: string;
    message: any;
    signUpForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

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

        // Set the private defaults
        this._unsubscribeAll = new Subject();
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
        this.signUpForm = this._formBuilder.group({
                name      : ['', Validators.required],
                email     : ['', [Validators.required, Validators.email]],
                password  : ['', Validators.required],
                company   : [''],
                agreements: ['', Validators.requiredTrue]
            }
        );

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

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
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
     * Sign up
     */
    signUp(): void
    {
        // Do nothing if the form is invalid
        if ( this.signUpForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the message
        this.message = null;

        // Do your action here...

        // Emulate server delay
        setTimeout(() => {

            // Re-enable the form
            this.signUpForm.enable();

            // Reset the form
            this.signUpForm.reset({});

            // Show the message
            this.message = {
                appearance: 'outline',
                content   : 'Your account has been created and a confirmation mail has been sent to your email address.',
                shake     : false,
                showIcon  : false,
                type      : 'success'
            };
        }, 1000);
    }
}
