import { Route } from '@angular/router';
import { IconsComponent } from 'app/modules/admin/ui/icons/icons.component';
import { IconsResolver } from 'app/modules/admin/ui/icons/icons.resolvers';

export const iconRoutes: Route[] = [
    {
        // Redirect /icons to /icons/material-twotone
        path      : '',
        pathMatch : 'full',
        redirectTo: 'material-twotone'
    },
    {
        path     : '',
        component: IconsComponent,
        children : [
            {
                path   : '**',
                resolve: {
                    icons: IconsResolver
                }
            }
        ]
    }
];
