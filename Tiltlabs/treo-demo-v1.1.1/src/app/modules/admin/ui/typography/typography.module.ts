import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { TreoHighlightModule } from '@treo/components/highlight';
import { SharedModule } from 'app/shared/shared.module';
import { TypographyComponent } from 'app/modules/admin/ui/typography/typography.component';
import { typographyRoutes } from 'app/modules/admin/ui/typography/typography.routing';

@NgModule({
    declarations: [
        TypographyComponent
    ],
    imports     : [
        RouterModule.forChild(typographyRoutes),
        MatTabsModule,
        TreoHighlightModule,
        SharedModule
    ]
})
export class TypographyModule
{
}
