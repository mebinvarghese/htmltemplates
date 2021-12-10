import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { TreoCardModule } from '@treo/components/card';
import { TreoHighlightModule } from '@treo/components/highlight';
import { TreoMessageModule } from '@treo/components/message';
import { SharedModule } from 'app/shared/shared.module';
import { HelpersComponent } from 'app/modules/admin/ui/helpers/helpers.component';
import { helpersRoutes } from 'app/modules/admin/ui/helpers/helpers.routing';

@NgModule({
    declarations: [
        HelpersComponent
    ],
    imports     : [
        RouterModule.forChild(helpersRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMomentDateModule,
        MatSelectModule,
        MatTabsModule,
        TreoCardModule,
        TreoHighlightModule,
        TreoMessageModule,
        SharedModule
    ]
})
export class HelpersModule
{
}
