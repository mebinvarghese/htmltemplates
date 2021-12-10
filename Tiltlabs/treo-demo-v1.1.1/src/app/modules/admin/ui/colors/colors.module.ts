import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TreoHighlightModule } from '@treo/components/highlight';
import { SharedModule } from 'app/shared/shared.module';
import { ColorsComponent } from 'app/modules/admin/ui/colors/colors.component';
import { colorsRoutes } from 'app/modules/admin/ui/colors/colors.routing';

@NgModule({
    declarations: [
        ColorsComponent
    ],
    imports     : [
        RouterModule.forChild(colorsRoutes),
        MatIconModule,
        MatRippleModule,
        MatTabsModule,
        TreoHighlightModule,
        SharedModule
    ]
})
export class ColorsModule
{
}
