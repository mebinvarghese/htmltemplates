import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'app/shared/shared.module';
import { FormsFieldsComponent } from 'app/modules/admin/ui/forms/fields/fields.component';
import { formsFieldsRoutes } from 'app/modules/admin/ui/forms/fields/fields.routing';

@NgModule({
    declarations: [
        FormsFieldsComponent
    ],
    imports     : [
        RouterModule.forChild(formsFieldsRoutes),
        MatButtonModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatMomentDateModule,
        MatSelectModule,
        SharedModule
    ]
})
export class FormsFieldsModule
{
}
