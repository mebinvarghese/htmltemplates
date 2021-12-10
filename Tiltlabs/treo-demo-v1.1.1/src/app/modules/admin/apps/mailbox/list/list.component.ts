import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { MailboxService } from 'app/modules/admin/apps/mailbox/mailbox.service';
import { MailboxComponent } from 'app/modules/admin/apps/mailbox/mailbox.component';
import { Mail, MailCategory } from 'app/modules/admin/apps/mailbox/mailbox.types';

@Component({
    selector     : 'mailbox-list',
    templateUrl  : './list.component.html',
    styleUrls    : ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MailboxListComponent implements OnInit, OnDestroy
{
    category: MailCategory;
    mails: Mail[];
    mailsLoading: boolean;
    pagination: any;
    selectedMail: Mail;

    @ViewChild('mailList')
    mailList: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MailboxComponent} mailboxComponent
     * @param {MailboxService} _mailboxService
     */
    constructor(
        public mailboxComponent: MailboxComponent,
        private _mailboxService: MailboxService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        // Set the defaults
        this.mailsLoading = false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Category
        this._mailboxService.category$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((category: MailCategory) => {
                this.category = category;
            });

        // Mails
        this._mailboxService.mails$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((mails: Mail[]) => {
                this.mails = mails;
            });

        // Mails loading
        this._mailboxService.mailsLoading$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((mailsLoading: boolean) => {
                this.mailsLoading = mailsLoading;

                // If the mail list element is available & the mails are loaded...
                if ( this.mailList && !mailsLoading )
                {
                    // Reset the mail list element scroll position to top
                    this.mailList.nativeElement.scrollTo(0, 0);
                }
            });

        // Pagination
        this._mailboxService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination) => {
                this.pagination = pagination;
            });

        // Selected mail
        this._mailboxService.mail$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((mail: Mail) => {
                this.selectedMail = mail;
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
     * On mail selected
     *
     * @param mail
     */
    onMailSelected(mail: Mail): void
    {
        // If the mail is unread...
        if ( mail.unread )
        {
            // Update the mail object
            mail.unread = false;

            // Update the mail on the server
            this._mailboxService.updateMail(mail.id, {unread: false}).subscribe();
        }

        // Execute the mailSelected observable
        this._mailboxService.selectedMailChanged.next(mail);
    }

    /**
     * Generate and return mail list group label if necessary or return false
     *
     * @param index
     */
    mailListGroupLabel(index: number): string | false
    {
        const previousMail = this.mails[index - 1];
        const currentMail = this.mails[index];

        // Generate and return label, if there is no previous mail
        if ( !previousMail )
        {
            return this._generateMailListGroupLabel(this.mails[index].date);
        }

        // Return false, if the two dates are equal by day
        if ( moment(previousMail.date, moment.ISO_8601).isSame(moment(currentMail.date, moment.ISO_8601), 'day') )
        {
            return false;
        }

        // Generate and return label
        return this._generateMailListGroupLabel(this.mails[index].date);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Generate a mail list group label based on the date
     *
     * @param mailDate
     * @private
     */
    private _generateMailListGroupLabel(mailDate: string): string
    {
        const date = moment(mailDate, moment.ISO_8601);
        const today = moment();
        const yesterday = moment().subtract(1, 'day');

        // Check if the mail date is today
        if ( date.isSame(today, 'day') )
        {
            // Return 'Today'
            return 'Today';
        }

        // Check if the mail date is yesterday
        if ( date.isSame(yesterday, 'day') )
        {
            // Return 'Yesterday'
            return 'Yesterday';
        }

        // Check if we are in the same year with the mail date...
        if ( date.isSame(today, 'year') )
        {
            // Return a date without a year
            return date.format('MMMM DD');
        }

        // Return a date
        return date.format('LL');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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
