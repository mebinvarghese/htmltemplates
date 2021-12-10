import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TreoMediaWatcherService } from '@treo/services/media-watcher';

@Component({
    selector   : 'right-sidebar-fullheight-tabs-navigation',
    templateUrl: './tabs-navigation.component.html',
    styleUrls  : ['./tabs-navigation.component.scss']
})
export class RightSidebarFullheightTabsNavigationComponent implements OnInit, OnDestroy
{
    drawerMode: 'over' | 'side';
    drawerOpened: boolean;
    navLinks: any[];
    scrollMode: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {TreoMediaWatcherService} _treoMediaWatcherService
     */
    constructor(
        private _treoMediaWatcherService: TreoMediaWatcherService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        // Set the defaults
        this.drawerMode = 'side';
        this.drawerOpened = true;
        this.navLinks = [
            {
                path : 'tab-1',
                title: 'First Tab'
            },
            {
                path : 'tab-2',
                title: 'Second Tab'
            },
            {
                path : 'tab-3',
                title: 'Third Tab'
            }
        ];
        this.scrollMode = 'normal';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to media changes
        this._treoMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode and drawerOpened if 'lt-lg' breakpoint is active
                if ( matchingAliases.includes('lt-lg') )
                {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }
                else
                {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
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
}
