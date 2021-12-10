import { Route } from '@angular/router';
import { ConfirmationRequiredComponent } from 'app/modules/admin/pages/authentication/confirmation-required/confirmation-required.component';

export const confirmationRequiredRoutes: Route[] = [
    // Redirect empty route
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'classic'
    },
    // Use 'empty' layout on 'fullscreen' style
    {
        path     : 'fullscreen',
        component: ConfirmationRequiredComponent,
        data     : {
            layout: 'empty'
        }
    },
    // Use 'empty' layout on 'fullscreen-alt' style
    {
        path     : 'fullscreen-alt',
        component: ConfirmationRequiredComponent,
        data     : {
            layout: 'empty'
        }
    },
    // Use defaults on other styles
    {
        path     : '**',
        component: ConfirmationRequiredComponent
    }
];
