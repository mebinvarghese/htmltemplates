import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'pricing-single',
    templateUrl    : './single.component.html',
    styleUrls      : ['./single.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricingSingleComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
