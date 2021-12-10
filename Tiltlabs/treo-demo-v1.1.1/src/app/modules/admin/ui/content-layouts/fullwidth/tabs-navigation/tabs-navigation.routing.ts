import { Route } from '@angular/router';
import { FullwidthTabsNavigationComponent } from 'app/modules/admin/ui/content-layouts/fullwidth/tabs-navigation/tabs-navigation.component';
import { FullwidthTabsNavigationTab1Component } from 'app/modules/admin/ui/content-layouts/fullwidth/tabs-navigation/tabs/tab-1/tab-1.component';
import { FullwidthTabsNavigationTab2Component } from 'app/modules/admin/ui/content-layouts/fullwidth/tabs-navigation/tabs/tab-2/tab-2.component';
import { FullwidthTabsNavigationTab3Component } from 'app/modules/admin/ui/content-layouts/fullwidth/tabs-navigation/tabs/tab-3/tab-3.component';

export const fullwidthTabsNavigationRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'tab-1'
    },
    {
        path     : '',
        component: FullwidthTabsNavigationComponent,
        children : [
            {
                path     : 'tab-1',
                component: FullwidthTabsNavigationTab1Component
            },
            {
                path     : 'tab-2',
                component: FullwidthTabsNavigationTab2Component
            },
            {
                path     : 'tab-3',
                component: FullwidthTabsNavigationTab3Component
            }
        ]
    }
];
