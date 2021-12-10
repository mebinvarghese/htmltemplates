import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentLayoutsOverviewComponent } from 'app/modules/admin/ui/content-layouts/overview/overview.component';
import { contentLayoutsOverviewRoutes } from 'app/modules/admin/ui/content-layouts/overview/overview.routing';

@NgModule({
    declarations: [
        ContentLayoutsOverviewComponent
    ],
    imports     : [
        RouterModule.forChild(contentLayoutsOverviewRoutes)
    ]
})
export class ContentLayoutsOverviewModule
{
}
