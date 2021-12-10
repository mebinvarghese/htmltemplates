import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TreoCardModule } from '@treo/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { PricingSingleComponent } from 'app/modules/admin/pages/pricing/single/single.component';
import { pricingSingleRoutes } from 'app/modules/admin/pages/pricing/single/single.routing';

@NgModule({
    declarations: [
        PricingSingleComponent
    ],
    imports     : [
        RouterModule.forChild(pricingSingleRoutes),
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule,
        TreoCardModule,
        SharedModule
    ]
})
export class PricingSingleModule
{
}
