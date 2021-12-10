import { Route } from '@angular/router';
import { RightSidebarContentTabsNavigationComponent } from 'app/modules/admin/ui/content-layouts/right-sidebar/content/tabs-navigation/tabs-navigation.component';
import { RightSidebarContentTabsNavigationTab1Component } from 'app/modules/admin/ui/content-layouts/right-sidebar/content/tabs-navigation/tabs/tab-1/tab-1.component';
import { RightSidebarContentTabsNavigationTab2Component } from 'app/modules/admin/ui/content-layouts/right-sidebar/content/tabs-navigation/tabs/tab-2/tab-2.component';
import { RightSidebarContentTabsNavigationTab3Component } from 'app/modules/admin/ui/content-layouts/right-sidebar/content/tabs-navigation/tabs/tab-3/tab-3.component';

export const rightSidebarContentTabsNavigationRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'tab-1'
    },
    {
        path     : '',
        component: RightSidebarContentTabsNavigationComponent,
        children : [
            {
                path     : 'tab-1',
                component: RightSidebarContentTabsNavigationTab1Component
            },
            {
                path     : 'tab-2',
                component: RightSidebarContentTabsNavigationTab2Component
            },
            {
                path     : 'tab-3',
                component: RightSidebarContentTabsNavigationTab3Component
            }
        ]
    }
];
