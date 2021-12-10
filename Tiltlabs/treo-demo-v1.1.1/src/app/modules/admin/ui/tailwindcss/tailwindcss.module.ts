import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { TailwindCSSComponent } from 'app/modules/admin/ui/tailwindcss/tailwindcss.component';
import { tailwindCSSRoutes } from 'app/modules/admin/ui/tailwindcss/tailwindcss.routing';

@NgModule({
    declarations: [
        TailwindCSSComponent
    ],
    imports     : [
        RouterModule.forChild(tailwindCSSRoutes),
        SharedModule
    ]
})
export class TailwindCSSModule
{
}
