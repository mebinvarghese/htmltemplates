import { Route } from '@angular/router';
import { LeftSidebarContentTabsComponent } from 'app/modules/admin/ui/content-layouts/left-sidebar/content/tabs/tabs.component';

export const leftSidebarContentTabsRoutes: Route[] = [
    {
        path     : '',
        component: LeftSidebarContentTabsComponent
    }
];
