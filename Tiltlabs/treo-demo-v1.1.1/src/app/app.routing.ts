import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards/finance'
    {path: '', pathMatch : 'full', redirectTo: 'dashboards/finance'},

    // Redirect signed in user to the '/dashboards/finance'
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboards/finance'},

    // Auth routes (guest)
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
        ]
    },

    // Auth routes (logged in)
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
        ]
    },

    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [

            // Dashboards
            {path: 'dashboards', children: [
                {path: 'finance', loadChildren: () => import('app/modules/admin/dashboards/finance/finance.module').then(m => m.FinanceModule)},
                {path: 'analytics', loadChildren: () => import('app/modules/admin/dashboards/analytics/analytics.module').then(m => m.AnalyticsModule)},
                {path: 'crypto', loadChildren: () => import('app/modules/admin/dashboards/crypto/crypto.module').then(m => m.CryptoModule)},
            ]},

            // Apps
            {path: 'apps', children: [
                {path: 'calendar', loadChildren: () => import('app/modules/admin/apps/calendar/calendar.module').then(m => m.CalendarModule)},
                {path: 'contacts', loadChildren: () => import('app/modules/admin/apps/contacts/contacts.module').then(m => m.ContactsModule)},
                {path: 'ecommerce', loadChildren: () => import('app/modules/admin/apps/ecommerce/ecommerce.module').then(m => m.ECommerceModule)},
                {path: 'mailbox', loadChildren: () => import('app/modules/admin/apps/mailbox/mailbox.module').then(m => m.MailboxModule)},
                {path: 'tasks', loadChildren: () => import('app/modules/admin/apps/tasks/tasks.module').then(m => m.TasksModule)},
            ]},

            // Pages
            {path: 'pages', children: [

                // Authentication
                {path: 'authentication', children: [
                    {path: 'confirmation-required', loadChildren: () => import('app/modules/admin/pages/authentication/confirmation-required/confirmation-required.module').then(m => m.ConfirmationRequiredModule)},
                    {path: 'forgot-password', loadChildren: () => import('app/modules/admin/pages/authentication/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)},
                    {path: 'reset-password', loadChildren: () => import('app/modules/admin/pages/authentication/reset-password/reset-password.module').then(m => m.ResetPasswordModule)},
                    {path: 'sign-in', loadChildren: () => import('app/modules/admin/pages/authentication/sign-in/sign-in.module').then(m => m.SignInModule)},
                    {path: 'sign-up', loadChildren: () => import('app/modules/admin/pages/authentication/sign-up/sign-up.module').then(m => m.SignUpModule)},
                    {path: 'sign-out', loadChildren: () => import('app/modules/admin/pages/authentication/sign-out/sign-out.module').then(m => m.SignOutModule)},
                    {path: 'unlock-session', loadChildren: () => import('app/modules/admin/pages/authentication/unlock-session/unlock-session.module').then(m => m.UnlockSessionModule)}
                ]},

                // Coming soon
                {path: 'coming-soon', loadChildren: () => import('app/modules/admin/pages/coming-soon/coming-soon.module').then(m => m.ComingSoonModule)},

                // Errors
                {path: 'errors', children: [
                    {path: '404', loadChildren: () => import('app/modules/admin/pages/errors/error-404/error-404.module').then(m => m.Error404Module)},
                    {path: '500', loadChildren: () => import('app/modules/admin/pages/errors/error-500/error-500.module').then(m => m.Error500Module)}
                ]},

                // Help center
                {path: 'help-center', loadChildren: () => import('app/modules/admin/pages/help-center/help-center.module').then(m => m.HelpCenterModule)},

                // Maintenance
                {path: 'maintenance', loadChildren: () => import('app/modules/admin/pages/maintenance/maintenance.module').then(m => m.MaintenanceModule)},

                // Pricing
                {path: 'pricing', children: [
                    {path: 'modern', loadChildren: () => import('app/modules/admin/pages/pricing/modern/modern.module').then(m => m.PricingModernModule)},
                    {path: 'simple', loadChildren: () => import('app/modules/admin/pages/pricing/simple/simple.module').then(m => m.PricingSimpleModule)},
                    {path: 'single', loadChildren: () => import('app/modules/admin/pages/pricing/single/single.module').then(m => m.PricingSingleModule)},
                    {path: 'table', loadChildren: () => import('app/modules/admin/pages/pricing/table/table.module').then(m => m.PricingTableModule)}
                ]},

                // Profile
                {path: 'profile', loadChildren: () => import('app/modules/admin/pages/profile/profile.module').then(m => m.ProfileModule)},
            ]},

            // User interface
            {path: 'ui', children: [

                // Angular Material
                {path: 'angular-material', loadChildren: () => import('app/modules/admin/ui/angular-material/angular-material.module').then(m => m.AngularMaterialModule)},

                // TailwindCSS
                {path: 'tailwindcss', loadChildren: () => import('app/modules/admin/ui/tailwindcss/tailwindcss.module').then(m => m.TailwindCSSModule)},

                // Animations
                {path: 'animations', loadChildren: () => import('app/modules/admin/ui/animations/animations.module').then(m => m.AnimationsModule)},

                 // Cards
                {path: 'cards', loadChildren: () => import('app/modules/admin/ui/cards/cards.module').then(m => m.CardsModule)},

                // Colors
                {path: 'colors', loadChildren: () => import('app/modules/admin/ui/colors/colors.module').then(m => m.ColorsModule)},

                // Content layouts
                {path: 'content-layouts', children: [

                    // Overview
                    {path: 'overview', loadChildren: () => import('app/modules/admin/ui/content-layouts/overview/overview.module').then(m => m.ContentLayoutsOverviewModule)},

                    // Fullwidth
                    {path: 'fullwidth', children: [
                        {path: 'basic', loadChildren: () => import('app/modules/admin/ui/content-layouts/fullwidth/basic/basic.module').then(m => m.FullwidthBasicModule)},
                        {path: 'standard', loadChildren: () => import('app/modules/admin/ui/content-layouts/fullwidth/standard/standard.module').then(m => m.FullwidthStandardModule)},
                        {path: 'tabs', loadChildren: () => import('app/modules/admin/ui/content-layouts/fullwidth/tabs/tabs.module').then(m => m.FullwidthTabsModule)},
                        {path: 'tabs-navigation', loadChildren: () => import('app/modules/admin/ui/content-layouts/fullwidth/tabs-navigation/tabs-navigation.module').then(m => m.FullwidthTabsNavigationModule)}
                    ]},

                    // Left sidebar
                    {path: 'left-sidebar', children: [

                        {path: 'fullheight', children: [
                            {path: 'basic', loadChildren: () => import('app/modules/admin/ui/content-layouts/left-sidebar/fullheight/basic/basic.module').then(m => m.LeftSidebarFullheightBasicModule)},
                            {path: 'standard', loadChildren: () => import('app/modules/admin/ui/content-layouts/left-sidebar/fullheight/standard/standard.module').then(m => m.LeftSidebarFullheightStandardModule)},
                            {path: 'tabs', loadChildren: () => import('app/modules/admin/ui/content-layouts/left-sidebar/fullheight/tabs/tabs.module').then(m => m.LeftSidebarFullheightTabsModule)},
                            {path: 'tabs-navigation', loadChildren: () => import('app/modules/admin/ui/content-layouts/left-sidebar/fullheight/tabs-navigation/tabs-navigation.module').then(m => m.LeftSidebarFullheightTabsNavigationModule)}
                        ]},

                        {path: 'content', children: [
                            {path: 'standard', loadChildren: () => import('app/modules/admin/ui/content-layouts/left-sidebar/content/standard/standard.module').then(m => m.LeftSidebarContentStandardModule)},
                            {path: 'tabs', loadChildren: () => import('app/modules/admin/ui/content-layouts/left-sidebar/content/tabs/tabs.module').then(m => m.LeftSidebarContentTabsModule)},
                            {path: 'tabs-navigation', loadChildren: () => import('app/modules/admin/ui/content-layouts/left-sidebar/content/tabs-navigation/tabs-navigation.module').then(m => m.LeftSidebarContentTabsNavigationModule)}
                        ]}
                    ]},

                    // Right sidebar
                    {path: 'right-sidebar', children: [

                        {path: 'fullheight', children: [
                            {path: 'basic', loadChildren: () => import('app/modules/admin/ui/content-layouts/right-sidebar/fullheight/basic/basic.module').then(m => m.RightSidebarFullheightBasicModule)},
                            {path: 'standard', loadChildren: () => import('app/modules/admin/ui/content-layouts/right-sidebar/fullheight/standard/standard.module').then(m => m.RightSidebarFullheightStandardModule)},
                            {path: 'tabs', loadChildren: () => import('app/modules/admin/ui/content-layouts/right-sidebar/fullheight/tabs/tabs.module').then(m => m.RightSidebarFullheightTabsModule)},
                            {path: 'tabs-navigation', loadChildren: () => import('app/modules/admin/ui/content-layouts/right-sidebar/fullheight/tabs-navigation/tabs-navigation.module').then(m => m.RightSidebarFullheightTabsNavigationModule)}
                        ]},

                        {path: 'content', children: [
                            {path: 'standard', loadChildren: () => import('app/modules/admin/ui/content-layouts/right-sidebar/content/standard/standard.module').then(m => m.RightSidebarContentStandardModule)},
                            {path: 'tabs', loadChildren: () => import('app/modules/admin/ui/content-layouts/right-sidebar/content/tabs/tabs.module').then(m => m.RightSidebarContentTabsModule)},
                            {path: 'tabs-navigation', loadChildren: () => import('app/modules/admin/ui/content-layouts/right-sidebar/content/tabs-navigation/tabs-navigation.module').then(m => m.RightSidebarContentTabsNavigationModule)}
                        ]}
                    ]}
                ]},

                // Datatable
                {path: 'datatable', loadChildren: () => import('app/modules/admin/ui/datatable/datatable.module').then(m => m.DatatableModule)},

                // Forms
                {path: 'forms', children: [
                    {path: 'fields', loadChildren: () => import('app/modules/admin/ui/forms/fields/fields.module').then(m => m.FormsFieldsModule)},
                    {path: 'layouts', loadChildren: () => import('app/modules/admin/ui/forms/layouts/layouts.module').then(m => m.FormsLayoutsModule)},
                    {path: 'wizards', loadChildren: () => import('app/modules/admin/ui/forms/wizards/wizards.module').then(m => m.FormsWizardsModule)}
                ]},

                // Helpers
                {path: 'helpers', loadChildren: () => import('app/modules/admin/ui/helpers/helpers.module').then(m => m.HelpersModule)},

                // Icons
                {path: 'icons', loadChildren: () => import('app/modules/admin/ui/icons/icons.module').then(m => m.IconsModule)},

                // Typography
                {path: 'typography', loadChildren: () => import('app/modules/admin/ui/typography/typography.module').then(m => m.TypographyModule)}
            ]},

            // Documentation
            {path: 'docs', children: [

                // Changelog
                {path: 'changelog', loadChildren: () => import('app/modules/admin/docs/changelog/changelog.module').then(m => m.ChangelogModule)},

                // Guides
                {path: 'guides', loadChildren: () => import('app/modules/admin/docs/guides/guides.module').then(m => m.GuidesModule)},

                // Core features
                {path: 'core-features', loadChildren: () => import('app/modules/admin/docs/core-features/core-features.module').then(m => m.CoreFeaturesModule)},

                // Other components
                {path: 'other-components', loadChildren: () => import('app/modules/admin/docs/other-components/other-components.module').then(m => m.OtherComponentsModule)},
            ]},

            // 404 & Catch all
            {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/errors/error-404/error-404.module').then(m => m.Error404Module)},
            {path: '**', redirectTo: '404-not-found'}
        ]
    }
];
