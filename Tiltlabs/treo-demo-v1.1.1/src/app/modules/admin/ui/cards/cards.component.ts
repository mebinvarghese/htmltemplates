import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, QueryList, Renderer2, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { TreoCardComponent } from '@treo/components/card';

@Component({
    selector       : 'cards',
    templateUrl    : './cards.component.html',
    styleUrls      : ['./cards.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsComponent implements AfterViewInit
{
    filters: string[];
    numberOfCards: any;
    selectedFilter: string;

    // Private
    @ViewChildren(TreoCardComponent, {read: ElementRef})
    private _treoCards: QueryList<ElementRef>;

    /**
     * Constructor
     *
     * @param {Renderer2} _renderer2
     */
    constructor(
        private _renderer2: Renderer2
    )
    {
        // Set the defaults
        this.filters = ['all', 'article', 'listing', 'list', 'info', 'shopping', 'pricing', 'testimonial', 'post'];
        this.numberOfCards = {};
        this.selectedFilter = 'all';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        // Calculate the number of cards
        this._calcNumberOfCards();

        // Filter the cards for the first time
        this._filterCards();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _calcNumberOfCards(): void
    {
        // Prepare the numberOfCards object
        this.numberOfCards = {};

        // Prepare the count
        let count = 0;

        // Go through the filters
        this.filters.forEach((filter) => {

            // For each filter, calculate the card count
            if ( filter === 'all' )
            {
                count = this._treoCards.length;
            }
            else
            {
                count = this.numberOfCards[filter] = this._treoCards.filter((treoCard) => treoCard.nativeElement.classList.contains('filter-' + filter)).length;
            }

            // Fill the numberOfCards object with the counts
            this.numberOfCards[filter] = count;
        });
    }

    /**
     * Filter the cards based on the selected filter
     *
     * @private
     */
    _filterCards(): void
    {
        // Go through all treo-cards
        this._treoCards.forEach((treoCard) => {

            // If the 'all' filter is selected...
            if ( this.selectedFilter === 'all' )
            {
                // Remove hidden class from all cards
                treoCard.nativeElement.classList.remove('hidden');
            }
            // Otherwise...
            else
            {
                // If the card has the class name that matches the selected filter...
                if ( treoCard.nativeElement.classList.contains('filter-' + this.selectedFilter) )
                {
                    // Remove the hidden class
                    treoCard.nativeElement.classList.remove('hidden');
                }
                // Otherwise
                else
                {
                    // Add the hidden class
                    treoCard.nativeElement.classList.add('hidden');
                }
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On filter change
     *
     * @param change
     */
    onFilterChange(change: MatButtonToggleChange): void
    {
        // Set the filter
        this.selectedFilter = change.value;

        // Filter the cards
        this._filterCards();
    }

}
