import { Route } from '@angular/router';
import { UnlockSessionComponent } from 'app/modules/admin/pages/authentication/unlock-session/unlock-session.component';

export const unlockSessionRoutes: Route[] = [
    // Redirect empty route
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'classic'
    },
    // Use 'empty' layout on 'fullscreen' style
    {
        path     : 'fullscreen',
        component: UnlockSessionComponent,
        data     : {
            layout: 'empty'
        }
    },
    // Use 'empty' layout on 'fullscreen-alt' style
    {
        path     : 'fullscreen-alt',
        component: UnlockSessionComponent,
        data     : {
            layout: 'empty'
        }
    },
    // Use defaults on other styles
    {
        path     : '**',
        component: UnlockSessionComponent
    }
];
