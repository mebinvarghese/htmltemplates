import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TreoCardModule } from '@treo/components/card';
import { TreoMessageModule } from '@treo/components/message';
import { SharedModule } from 'app/shared/shared.module';
import { ForgotPasswordComponent } from 'app/modules/admin/pages/authentication/forgot-password/forgot-password.component';
import { forgotPasswordRoutes } from 'app/modules/admin/pages/authentication/forgot-password/forgot-password.routing';

@NgModule({
    declarations: [
        ForgotPasswordComponent
    ],
    imports     : [
        RouterModule.forChild(forgotPasswordRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        TreoCardModule,
        TreoMessageModule,
        SharedModule
    ]
})
export class ForgotPasswordModule
{
}
