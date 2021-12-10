import { Route } from '@angular/router';
import { ContentLayoutsOverviewComponent } from 'app/modules/admin/ui/content-layouts/overview/overview.component';

export const contentLayoutsOverviewRoutes: Route[] = [
    {
        path     : '',
        component: ContentLayoutsOverviewComponent
    }
];
