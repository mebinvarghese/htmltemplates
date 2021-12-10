import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { TreoHighlightModule } from '@treo/components/highlight';
import { TreoMessageModule } from '@treo/components/message';
import { TreoNavigationModule } from '@treo/components/navigation';
import { TreoScrollResetModule } from '@treo/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { GuidesComponent } from 'app/modules/admin/docs/guides/guides.component';
import { IntroductionComponent } from 'app/modules/admin/docs/guides/getting-started/introduction/introduction';
import { PrerequisitesComponent } from 'app/modules/admin/docs/guides/getting-started/prerequisites/prerequisites';
import { InstallationComponent } from 'app/modules/admin/docs/guides/getting-started/installation/installation';
import { ServingComponent } from 'app/modules/admin/docs/guides/getting-started/serving/serving';
import { DirectoryStructureComponent } from 'app/modules/admin/docs/guides/development/directory-structure/directory-structure';
import { ComponentStructureComponent } from 'app/modules/admin/docs/guides/development/component-structure/component-structure';
import { StarterKitComponent } from 'app/modules/admin/docs/guides/development/starter-kit/starter-kit';
import { DeploymentComponent } from 'app/modules/admin/docs/guides/development/deployment/deployment';
import { UpdatingComponent } from 'app/modules/admin/docs/guides/development/updating/updating';
import { ThemeLayoutsComponent } from 'app/modules/admin/docs/guides/customization/theme-layouts/theme-layouts';
import { ContentLayoutsComponent } from 'app/modules/admin/docs/guides/customization/content-layouts/content-layouts';
import { TailwindCSSComponent } from 'app/modules/admin/docs/guides/customization/tailwindcss/tailwindcss';
import { ThemingComponent } from 'app/modules/admin/docs/guides/customization/theming/theming';
import { SplashScreenCustomizationComponent } from 'app/modules/admin/docs/guides/customization/splash-screen/splash-screen';
import { JwtComponent } from 'app/modules/admin/docs/guides/authentication/jwt/jwt';
import { guidesRoutes } from 'app/modules/admin/docs/guides/guides.routing';

@NgModule({
    declarations: [
        GuidesComponent,
        IntroductionComponent,
        PrerequisitesComponent,
        InstallationComponent,
        ServingComponent,
        DirectoryStructureComponent,
        ComponentStructureComponent,
        StarterKitComponent,
        DeploymentComponent,
        UpdatingComponent,
        ThemeLayoutsComponent,
        ContentLayoutsComponent,
        TailwindCSSComponent,
        ThemingComponent,
        SplashScreenCustomizationComponent,
        JwtComponent
    ],
    imports     : [
        RouterModule.forChild(guidesRoutes),
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatTreeModule,
        TreoHighlightModule,
        TreoMessageModule,
        TreoNavigationModule,
        TreoScrollResetModule,
        SharedModule
    ]
})
export class GuidesModule
{
}
