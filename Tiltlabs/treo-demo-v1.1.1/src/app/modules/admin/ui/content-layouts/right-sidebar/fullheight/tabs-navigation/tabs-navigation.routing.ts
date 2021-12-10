import { Route } from '@angular/router';
import { RightSidebarFullheightTabsNavigationComponent } from 'app/modules/admin/ui/content-layouts/right-sidebar/fullheight/tabs-navigation/tabs-navigation.component';
import { RightSidebarFullheightTabsNavigationTab1Component } from 'app/modules/admin/ui/content-layouts/right-sidebar/fullheight/tabs-navigation/tabs/tab-1/tab-1.component';
import { RightSidebarFullheightTabsNavigationTab2Component } from 'app/modules/admin/ui/content-layouts/right-sidebar/fullheight/tabs-navigation/tabs/tab-2/tab-2.component';
import { RightSidebarFullheightTabsNavigationTab3Component } from 'app/modules/admin/ui/content-layouts/right-sidebar/fullheight/tabs-navigation/tabs/tab-3/tab-3.component';

export const rightSidebarFullheightTabsNavigationRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'tab-1'
    },
    {
        path     : '',
        component: RightSidebarFullheightTabsNavigationComponent,
        children : [
            {
                path     : 'tab-1',
                component: RightSidebarFullheightTabsNavigationTab1Component
            },
            {
                path     : 'tab-2',
                component: RightSidebarFullheightTabsNavigationTab2Component
            },
            {
                path     : 'tab-3',
                component: RightSidebarFullheightTabsNavigationTab3Component
            }
        ]
    }
];
