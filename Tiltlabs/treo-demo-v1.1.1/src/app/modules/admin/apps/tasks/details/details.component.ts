import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatButton } from '@angular/material/button';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';
import { assign } from 'lodash-es';
import * as moment from 'moment';
import { Tag, Task } from 'app/modules/admin/apps/tasks/tasks.types';
import { TasksListComponent } from 'app/modules/admin/apps/tasks/list/list.component';
import { TasksService } from 'app/modules/admin/apps/tasks/tasks.service';

@Component({
    selector       : 'tasks-details',
    templateUrl    : './details.component.html',
    styleUrls      : ['./details.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksDetailsComponent implements OnInit, AfterViewInit, OnDestroy
{
    tags: Tag[];
    tagsEditMode: boolean;
    filteredTags: Tag[];
    task: Task;
    taskForm: FormGroup;
    tasks: Task[];

    // Private
    private _dueDatePanelOverlayRef: OverlayRef;
    private _dueDatePanelTemplatePortal: TemplatePortal;
    private _priorityPanelOverlayRef: OverlayRef;
    private _priorityPanelTemplatePortal: TemplatePortal;
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any>;

    @ViewChild('dueDatePanelOrigin')
    private _dueDatePanelOrigin: MatButton;

    @ViewChild('dueDatePanel')
    private _dueDatePanel: TemplateRef<any>;

    @ViewChild('priorityPanelOrigin')
    private _priorityPanelOrigin: MatButton;

    @ViewChild('priorityPanel')
    private _priorityPanel: TemplateRef<any>;

    @ViewChild('tagsPanelOrigin')
    private _tagsPanelOrigin: MatButton;

    @ViewChild('tagsPanel')
    private _tagsPanel: TemplateRef<any>;

    @ViewChild('titleField')
    private _titleField: ElementRef;

    /**
     * Constructor
     *
     * @param {ActivatedRoute} _activatedRoute
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FormBuilder} _formBuilder
     * @param {Renderer2} _renderer2
     * @param {Router} _router
     * @param {TasksListComponent} _tasksListComponent
     * @param {TasksService} _tasksService
     * @param {Overlay} _overlay
     * @param {ViewContainerRef} _viewContainerRef
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _renderer2: Renderer2,
        private _router: Router,
        private _tasksListComponent: TasksListComponent,
        private _tasksService: TasksService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        // Set the defaults
        this.tagsEditMode = false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Open the drawer
        this._tasksListComponent.matDrawer.open();

        // Create the task form
        this.taskForm = this._formBuilder.group({
            id       : [''],
            type     : [''],
            title    : [''],
            notes    : [''],
            completed: [false],
            dueDate  : [null],
            priority : [0],
            tags     : [[]],
            order    : [0]
        });

        // Get the tags
        this._tasksService.tags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tags: Tag[]) => {
                this.tags = tags;
                this.filteredTags = tags;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the tasks
        this._tasksService.tasks$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tasks: Task[]) => {
                this.tasks = tasks;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the task
        this._tasksService.task$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((task: Task) => {

                // Open the drawer in case it is closed
                this._tasksListComponent.matDrawer.open();

                // Get the task
                this.task = task;

                // Patch values to the form from the task
                this.taskForm.patchValue(task, {emitEvent: false});

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Update task when there is a value change on the task form
        this.taskForm.valueChanges
            .pipe(
                tap((value) => {

                    // Update the task object
                    this.task = assign(this.task, value);
                }),
                debounceTime(300),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((value) => {

                // Update the task on the server
                this._tasksService.updateTask(value.id, value).subscribe();

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Listen for NavigationEnd event to focus on the title field
        this._router.events
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(event => event instanceof NavigationEnd)
            )
            .subscribe(() => {

                // Focus on the title field
                this._titleField.nativeElement.focus();
            });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        // Listen for matDrawer opened change
        this._tasksListComponent.matDrawer.openedChange
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(opened => opened)
            )
            .subscribe(() => {

                // Focus on the title element
                this._titleField.nativeElement.focus();
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

        // Dispose the overlays if they are still on the DOM
        if ( this._dueDatePanelOverlayRef )
        {
            this._dueDatePanelOverlayRef.dispose();
        }

        if ( this._priorityPanelOverlayRef )
        {
            this._priorityPanelOverlayRef.dispose();
        }

        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._tasksListComponent.matDrawer.close();
    }

    /**
     * Toggle the completed status
     */
    toggleCompleted(): void
    {
        // Get the form control for 'completed'
        const completedFormControl = this.taskForm.get('completed');

        // Toggle the completed status
        completedFormControl.setValue(!completedFormControl.value);
    }

    /**
     * Open tags panel
     */
    openTagsPanel(): void
    {
        // Create the overlay
        this._tagsPanelOverlayRef = this._overlay.create({
            backdropClass   : '',
            hasBackdrop     : true,
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(this._tagsPanelOrigin._elementRef.nativeElement)
                                  .withFlexibleDimensions()
                                  .withViewportMargin(64)
                                  .withLockedPosition()
                                  .withPositions([
                                      {
                                          originX : 'start',
                                          originY : 'bottom',
                                          overlayX: 'start',
                                          overlayY: 'top'
                                      }
                                  ])
        });

        // Subscribe to the attachments observable
        this._tagsPanelOverlayRef.attachments().subscribe(() => {

            // Focus to the search input once the overlay has been attached
            this._tagsPanelOverlayRef.overlayElement.querySelector('input').focus();
        });

        // Create a portal from the template
        const templatePortal = new TemplatePortal(this._tagsPanel, this._viewContainerRef);

        // Attach the portal to the overlay
        this._tagsPanelOverlayRef.attach(templatePortal);

        // Subscribe to the backdrop click
        this._tagsPanelOverlayRef.backdropClick().subscribe(() => {

            // If overlay exists and attached...
            if ( this._tagsPanelOverlayRef && this._tagsPanelOverlayRef.hasAttached() )
            {
                // Detach it
                this._tagsPanelOverlayRef.detach();

                // Reset the tag filter
                this.filteredTags = this.tags;

                // Toggle the edit mode off
                this.tagsEditMode = false;
            }

            // If template portal exists and attached...
            if ( templatePortal && templatePortal.isAttached )
            {
                // Detach it
                templatePortal.detach();
            }
        });
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
     * Filter tags
     *
     * @param event
     */
    filterTags(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredTags = this.tags.filter(tag => tag.title.toLowerCase().includes(value));
    }

    /**
     * Filter tags input key down event
     *
     * @param event
     */
    filterTagsInputKeyDown(event): void
    {
        // Return, if the pressed key is not 'Enter'
        if ( event.key !== 'Enter' )
        {
            return;
        }

        // If there is no tag available...
        if ( this.filteredTags.length === 0 )
        {
            // Create the tag
            this.createTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a tag...
        const tag = this.filteredTags[0];
        const isTagApplied = this.task.tags.find((id) => id === tag.id);

        // If the found tag is already applied to the task...
        if ( isTagApplied )
        {
            // Remove the tag from the task
            this.deleteTagFromTask(tag);
        }
        else
        {
            // Otherwise add the tag to the task
            this.addTagToTask(tag);
        }
    }

    /**
     * Create a new tag
     *
     * @param title
     */
    createTag(title: string): void
    {
        const tag = {
            title
        };

        // Create tag on the server
        this._tasksService.createTag(tag)
            .subscribe((response) => {

                // Add the tag to the task
                this.addTagToTask(response);
            });
    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateTagTitle(tag: Tag, event): void
    {
        // Update the title on the tag
        tag.title = event.target.value;

        // Update the tag on the server
        this._tasksService.updateTag(tag.id, tag)
            .pipe(debounceTime(300))
            .subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete the tag
     *
     * @param tag
     */
    deleteTag(tag: Tag): void
    {
        // Delete the tag from the server
        this._tasksService.deleteTag(tag.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add tag to the task
     *
     * @param tag
     */
    addTagToTask(tag: Tag): void
    {
        // Add the tag
        this.task.tags.unshift(tag.id);

        // Update the task form
        this.taskForm.get('tags').patchValue(this.task.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete tag from the task
     *
     * @param tag
     */
    deleteTagFromTask(tag: Tag): void
    {
        // Remove the tag
        this.task.tags.splice(this.task.tags.findIndex(item => item === tag.id), 1);

        // Update the task form
        this.taskForm.get('tags').patchValue(this.task.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle task tag
     *
     * @param tag
     * @param change
     */
    toggleTaskTag(tag: Tag, change: MatCheckboxChange): void
    {
        if ( change.checked )
        {
            this.addTagToTask(tag);
        }
        else
        {
            this.deleteTagFromTask(tag);
        }
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateTagButton(inputValue: string): boolean
    {
        return !!!(inputValue === '' || this.tags.findIndex(tag => tag.title.toLowerCase() === inputValue.toLowerCase()) > -1);
    }

    /**
     * Open priority panel
     */
    openPriorityPanel(): void
    {
        // Create the overlay
        this._priorityPanelOverlayRef = this._overlay.create({
            backdropClass   : '',
            hasBackdrop     : true,
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(this._priorityPanelOrigin._elementRef.nativeElement)
                                  .withFlexibleDimensions()
                                  .withViewportMargin(64)
                                  .withLockedPosition()
                                  .withPositions([
                                      {
                                          originX : 'start',
                                          originY : 'bottom',
                                          overlayX: 'start',
                                          overlayY: 'top'
                                      }
                                  ])
        });

        // Create a portal from the template
        this._priorityPanelTemplatePortal = new TemplatePortal(this._priorityPanel, this._viewContainerRef);

        // Attach the portal to the overlay
        this._priorityPanelOverlayRef.attach(this._priorityPanelTemplatePortal);

        // Subscribe to the backdrop click
        this._priorityPanelOverlayRef.backdropClick().subscribe(() => {

            // Close the panel
            this.closePriorityPanel();
        });
    }

    /**
     * Close the priority panel if it's open
     */
    closePriorityPanel(): void
    {
        // If overlay exists and attached...
        if ( this._priorityPanelOverlayRef && this._priorityPanelOverlayRef.hasAttached() )
        {
            // Detach it
            this._priorityPanelOverlayRef.detach();
        }

        // If template portal exists and attached...
        if ( this._priorityPanelTemplatePortal && this._priorityPanelTemplatePortal.isAttached )
        {
            // Detach it
            this._priorityPanelTemplatePortal.detach();
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Open due date panel
     */
    openDueDatePanel(): void
    {
        // Create the overlay
        this._dueDatePanelOverlayRef = this._overlay.create({
            backdropClass   : '',
            hasBackdrop     : true,
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(this._dueDatePanelOrigin._elementRef.nativeElement)
                                  .withFlexibleDimensions()
                                  .withViewportMargin(64)
                                  .withLockedPosition()
                                  .withPositions([
                                      {
                                          originX : 'end',
                                          originY : 'bottom',
                                          overlayX: 'end',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'start',
                                          originY : 'bottom',
                                          overlayX: 'start',
                                          overlayY: 'top'
                                      }
                                  ])
        });

        // Create a portal from the template
        this._dueDatePanelTemplatePortal = new TemplatePortal(this._dueDatePanel, this._viewContainerRef);

        // Attach the portal to the overlay
        this._dueDatePanelOverlayRef.attach(this._dueDatePanelTemplatePortal);

        // Subscribe to the backdrop click
        this._dueDatePanelOverlayRef.backdropClick().subscribe(() => {

            // Close the panel
            this.closeDueDatePanel();
        });
    }

    /**
     * Close the due date panel
     */
    closeDueDatePanel(): void
    {
        // If overlay exists and attached...
        if ( this._dueDatePanelOverlayRef && this._dueDatePanelOverlayRef.hasAttached() )
        {
            // Detach it
            this._dueDatePanelOverlayRef.detach();
        }

        // If template portal exists and attached...
        if ( this._dueDatePanelTemplatePortal && this._dueDatePanelTemplatePortal.isAttached )
        {
            // Detach it
            this._dueDatePanelTemplatePortal.detach();
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Update the due date
     *
     * @param event
     */
    updateDueDate(event: moment.Moment): void
    {
        // Get the form control for 'dueDate'
        const dueDateFormControl = this.taskForm.get('dueDate');

        // Update it
        dueDateFormControl.setValue(event.toISOString());

        // Close the due date panel...
        this.closeDueDatePanel();
    }

    /**
     * Remove the due date
     */
    removeDueDate(): void
    {
        // Get the form control for 'dueDate'
        const dueDateFormControl = this.taskForm.get('dueDate');

        // Clear the due date
        dueDateFormControl.setValue(null);

        // Close the due date panel...
        this.closeDueDatePanel();
    }

    /**
     * Check if the task is overdue or not
     */
    isOverdue(): boolean
    {
        return moment(this.task.dueDate, moment.ISO_8601).isBefore(moment(), 'days');
    }

    /**
     * Delete the task
     */
    deleteTask(): void
    {
        // Get the current task's id
        const id = this.task.id;

        // Get the next/previous task's id
        const currentTaskIndex = this.tasks.findIndex(item => item.id === id);
        const nextTaskIndex = currentTaskIndex + ((currentTaskIndex === (this.tasks.length - 1)) ? -1 : 1);
        const nextTaskId = (this.tasks.length === 1 && this.tasks[0].id === id) ? null : this.tasks[nextTaskIndex].id;

        // Delete the task
        this._tasksService.deleteTask(id)
            .subscribe((isDeleted) => {

                // Return if the task wasn't deleted...
                if ( !isDeleted )
                {
                    return;
                }

                // Get the current activated route
                let route = this._activatedRoute;
                while ( route.firstChild )
                {
                    route = route.firstChild;
                }

                // Navigate to the next task if available
                if ( nextTaskId )
                {
                    this._router.navigate(['../', nextTaskId], {relativeTo: route});
                }
                // Otherwise, navigate to the parent
                else
                {
                    this._router.navigate(['../'], {relativeTo: route});
                }
            });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
