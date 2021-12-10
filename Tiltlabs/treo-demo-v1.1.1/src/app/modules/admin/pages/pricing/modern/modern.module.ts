import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TreoCardModule } from '@treo/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { PricingModernComponent } from 'app/modules/admin/pages/pricing/modern/modern.component';
import { pricingModernRoutes } from 'app/modules/admin/pages/pricing/modern/modern.routing';

@NgModule({
    declarations: [
        PricingModernComponent
    ],
    imports     : [
        RouterModule.forChild(pricingModernRoutes),
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule,
        TreoCardModule,
        SharedModule
    ]
})
export class PricingModernModule
{
}
