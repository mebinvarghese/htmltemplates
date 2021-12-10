import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TreoCardModule } from '@treo/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { ConfirmationRequiredComponent } from 'app/modules/admin/pages/authentication/confirmation-required/confirmation-required.component';
import { confirmationRequiredRoutes } from 'app/modules/admin/pages/authentication/confirmation-required/confirmation-required.routing';

@NgModule({
    declarations: [
        ConfirmationRequiredComponent
    ],
    imports     : [
        RouterModule.forChild(confirmationRequiredRoutes),
        MatButtonModule,
        TreoCardModule,
        SharedModule
    ]
})
export class ConfirmationRequiredModule
{
}
