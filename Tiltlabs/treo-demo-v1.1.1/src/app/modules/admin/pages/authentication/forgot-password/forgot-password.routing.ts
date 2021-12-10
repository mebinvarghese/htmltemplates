import { Route } from '@angular/router';
import { ForgotPasswordComponent } from 'app/modules/admin/pages/authentication/forgot-password/forgot-password.component';

export const forgotPasswordRoutes: Route[] = [
    // Redirect empty route
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'classic'
    },
    // Use 'empty' layout on 'fullscreen' style
    {
        path     : 'fullscreen',
        component: ForgotPasswordComponent,
        data     : {
            layout: 'empty'
        }
    },
    // Use 'empty' layout on 'fullscreen-alt' style
    {
        path     : 'fullscreen-alt',
        component: ForgotPasswordComponent,
        data     : {
            layout: 'empty'
        }
    },
    // Use defaults on other styles
    {
        path     : '**',
        component: ForgotPasswordComponent
    }
];
