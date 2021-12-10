import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';
import { Calendar } from 'app/modules/admin/apps/calendar/calendar.types';
import { CalendarService } from 'app/modules/admin/apps/calendar/calendar.service';
import { calendarColors } from 'app/modules/admin/apps/calendar/sidebar/calendar-colors';

@Component({
    selector     : 'calendar-sidebar',
    templateUrl  : './sidebar.component.html',
    styleUrls    : ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CalendarSidebarComponent implements OnInit, OnDestroy
{
    calendar: Calendar | null;
    calendarColors: any;
    calendars: Calendar[];

    @Output()
    calendarUpdated: EventEmitter<any>;

    // Private
    private _editPanelOverlayRef: OverlayRef;
    private _editPanelTemplatePortal: TemplatePortal;
    private _unsubscribeAll: Subject<any>;

    @ViewChild('editPanel')
    private _editPanel: TemplateRef<any>;

    /**
     * Constructor
     *
     * @param {CalendarService} _calendarService
     * @param {Overlay} _overlay
     * @param {ViewContainerRef} _viewContainerRef
     */
    constructor(
        private _calendarService: CalendarService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        // Set the defaults
        this.calendarColors = calendarColors;
        this.calendarUpdated = new EventEmitter();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get calendars
        this._calendarService.calendars$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((calendars) => {

                // Store the calendars
                this.calendars = calendars;
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
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open edit panel
     */
    openEditPanel(calendar: Calendar): void
    {
        // Set the calendar
        this.calendar = cloneDeep(calendar);

        // Create the overlay
        this._editPanelOverlayRef = this._overlay.create({
            panelClass      : 'calendar-sidebar-calendar-edit-panel',
            hasBackdrop     : true,
            scrollStrategy  : this._overlay.scrollStrategies.reposition(),
            positionStrategy: this._overlay.position()
                                  .global()
                                  .centerHorizontally()
                                  .centerVertically()
        });

        // Create a portal from the template
        this._editPanelTemplatePortal = new TemplatePortal(this._editPanel, this._viewContainerRef);

        // On backdrop click...
        this._editPanelOverlayRef.backdropClick().subscribe(() => {

            // Close the edit panel
            this.closeEditPanel();

            // Set the calendar as null
            this.calendar = null;
        });

        // Attach the portal to the overlay
        this._editPanelOverlayRef.attach(this._editPanelTemplatePortal);
    }

    /**
     * Close the edit panel
     */
    closeEditPanel(): void
    {
        // If template portal exists and attached...
        if ( this._editPanelTemplatePortal && this._editPanelTemplatePortal.isAttached )
        {
            // Detach it
            this._editPanelTemplatePortal.detach();
        }

        // If overlay exists and attached...
        if ( this._editPanelOverlayRef && this._editPanelOverlayRef.hasAttached() )
        {
            // Detach it
            this._editPanelOverlayRef.detach();
            this._editPanelOverlayRef.dispose();
        }
    }

    /**
     * Toggle the calendar visibility
     *
     * @param calendar
     */
    toggleCalendarVisibility(calendar: Calendar): void
    {
        // Toggle the visibility
        calendar.visible = !calendar.visible;

        // Update the calendar
        this.saveCalendar(calendar);
    }

    /**
     * Add calendar
     */
    addCalendar(): void
    {
        // Create a new calendar with default values
        const calendar = {
            id     : null,
            title  : '',
            color  : 'blue',
            visible: true
        };

        // Open the edit panel
        this.openEditPanel(calendar);
    }

    /**
     * Save the calendar
     *
     * @param calendar
     */
    saveCalendar(calendar: Calendar): void
    {
        // If there is no id on the calendar...
        if ( !calendar.id )
        {
            // Add calendar to the server
            this._calendarService.addCalendar(calendar).subscribe(() => {

                // Close the edit panel
                this.closeEditPanel();

                // Emit the calendarUpdated event
                this.calendarUpdated.emit();
            });
        }
        // Otherwise...
        else
        {
            // Update the calendar on the server
            this._calendarService.updateCalendar(calendar.id, calendar).subscribe(() => {

                // Close the edit panel
                this.closeEditPanel();

                // Emit the calendarUpdated event
                this.calendarUpdated.emit();
            });
        }
    }

    /**
     * Delete the calendar
     *
     * @param calendar
     */
    deleteCalendar(calendar: Calendar): void
    {
        // Delete the calendar on the server
        this._calendarService.deleteCalendar(calendar.id).subscribe(() => {

            // Close the edit panel
            this.closeEditPanel();

            // Emit the calendarUpdated event
            this.calendarUpdated.emit();
        });
    }
}
