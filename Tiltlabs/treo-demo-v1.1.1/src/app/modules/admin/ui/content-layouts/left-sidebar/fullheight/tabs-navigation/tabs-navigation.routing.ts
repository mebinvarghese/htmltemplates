import { Route } from '@angular/router';
import { LeftSidebarFullheightTabsNavigationComponent } from 'app/modules/admin/ui/content-layouts/left-sidebar/fullheight/tabs-navigation/tabs-navigation.component';
import { LeftSidebarFullheightTabsNavigationTab1Component } from 'app/modules/admin/ui/content-layouts/left-sidebar/fullheight/tabs-navigation/tabs/tab-1/tab-1.component';
import { LeftSidebarFullheightTabsNavigationTab2Component } from 'app/modules/admin/ui/content-layouts/left-sidebar/fullheight/tabs-navigation/tabs/tab-2/tab-2.component';
import { LeftSidebarFullheightTabsNavigationTab3Component } from 'app/modules/admin/ui/content-layouts/left-sidebar/fullheight/tabs-navigation/tabs/tab-3/tab-3.component';

export const leftSidebarFullheightTabsNavigationRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'tab-1'
    },
    {
        path     : '',
        component: LeftSidebarFullheightTabsNavigationComponent,
        children : [
            {
                path     : 'tab-1',
                component: LeftSidebarFullheightTabsNavigationTab1Component
            },
            {
                path     : 'tab-2',
                component: LeftSidebarFullheightTabsNavigationTab2Component
            },
            {
                path     : 'tab-3',
                component: LeftSidebarFullheightTabsNavigationTab3Component
            }
        ]
    }
];
