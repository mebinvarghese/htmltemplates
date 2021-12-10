import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TreoAnimations } from '@treo/animations';

@Component({
    selector     : 'confirmation-required',
    templateUrl  : './confirmation-required.component.html',
    styleUrls    : ['./confirmation-required.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : TreoAnimations
})
export class ConfirmationRequiredComponent implements OnInit
{
    cardStyle: string;

    /**
     * Constructor
     *
     * @param {ActivatedRoute} _activatedRoute
     * @param {Router} _router
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
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

}
