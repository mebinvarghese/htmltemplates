import { Route } from '@angular/router';
import { LeftSidebarContentTabsNavigationComponent } from 'app/modules/admin/ui/content-layouts/left-sidebar/content/tabs-navigation/tabs-navigation.component';
import { LeftSidebarContentTabsNavigationTab1Component } from 'app/modules/admin/ui/content-layouts/left-sidebar/content/tabs-navigation/tabs/tab-1/tab-1.component';
import { LeftSidebarContentTabsNavigationTab2Component } from 'app/modules/admin/ui/content-layouts/left-sidebar/content/tabs-navigation/tabs/tab-2/tab-2.component';
import { LeftSidebarContentTabsNavigationTab3Component } from 'app/modules/admin/ui/content-layouts/left-sidebar/content/tabs-navigation/tabs/tab-3/tab-3.component';

export const leftSidebarContentTabsNavigationRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'tab-1'
    },
    {
        path     : '',
        component: LeftSidebarContentTabsNavigationComponent,
        children : [
            {
                path     : 'tab-1',
                component: LeftSidebarContentTabsNavigationTab1Component
            },
            {
                path     : 'tab-2',
                component: LeftSidebarContentTabsNavigationTab2Component
            },
            {
                path     : 'tab-3',
                component: LeftSidebarContentTabsNavigationTab3Component
            }
        ]
    }
];
