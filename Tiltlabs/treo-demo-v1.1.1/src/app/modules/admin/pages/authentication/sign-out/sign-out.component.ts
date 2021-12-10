import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { interval, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

@Component({
    selector     : 'sign-out',
    templateUrl  : './sign-out.component.html',
    styleUrls    : ['./sign-out.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SignOutComponent implements OnInit, OnDestroy
{
    cardStyle: string;
    countdown: number;
    countdownMapping: any;

    // Private
    private _unsubscribeAll: Subject<any>;

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
        // Set the private default
        this._unsubscribeAll = new Subject();

        // Set the defaults
        this.countdown = 5;
        this.countdownMapping = {
            '=1'   : '# second',
            'other': '# seconds'
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
        // Get the duration
        const duration = this.countdown;

        // Redirect after the countdown
        interval(1000)
            .pipe(
                take(duration),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                    this.countdown--;
                },
                () => {
                },
                () => {
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
}
