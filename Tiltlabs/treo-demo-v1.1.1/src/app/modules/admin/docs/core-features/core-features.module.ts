import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { TreoCardModule } from '@treo/components/card';
import { TreoDateRangeModule } from '@treo/components/date-range';
import { TreoDrawerModule } from '@treo/components/drawer';
import { TreoHighlightModule } from '@treo/components/highlight';
import { TreoMessageModule } from '@treo/components/message';
import { TreoNavigationModule } from '@treo/components/navigation';
import { TreoScrollResetModule } from '@treo/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { CoreFeaturesComponent } from 'app/modules/admin/docs/core-features/core-features.component';
import { MockApiComponent } from 'app/modules/admin/docs/core-features/libraries/mock-api/mock-api.component';
import { CardComponent } from 'app/modules/admin/docs/core-features/components/card/card.component';
import { DateRangeComponent } from 'app/modules/admin/docs/core-features/components/date-range/date-range.component';
import { DrawerComponent } from 'app/modules/admin/docs/core-features/components/drawer/drawer.component';
import { HighlightComponent } from 'app/modules/admin/docs/core-features/components/highlight/highlight.component';
import { MessageComponent } from 'app/modules/admin/docs/core-features/components/message/message.component';
import { NavigationComponent } from 'app/modules/admin/docs/core-features/components/navigation/navigation.component';
import { AutogrowComponent } from 'app/modules/admin/docs/core-features/directives/autogrow/autogrow.component';
import { ScrollbarComponent } from 'app/modules/admin/docs/core-features/directives/scrollbar/scrollbar.component';
import { ScrollResetComponent } from 'app/modules/admin/docs/core-features/directives/scroll-reset/scroll-reset.component';
import { ConfigComponent } from 'app/modules/admin/docs/core-features/services/config/config.component';
import { MediaWatcherComponent } from 'app/modules/admin/docs/core-features/services/media-watcher/media-watcher.component';
import { SplashScreenComponent } from 'app/modules/admin/docs/core-features/services/splash-screen/splash-screen.component';
import { FindByKeyComponent } from 'app/modules/admin/docs/core-features/pipes/find-by-key/find-by-key.component';
import { MustMatchComponent } from 'app/modules/admin/docs/core-features/validators/must-match/must-match.component';
import { coreFeaturesRoutes } from 'app/modules/admin/docs/core-features/core-features.routing';

@NgModule({
    declarations: [
        CoreFeaturesComponent,
        MockApiComponent,
        CardComponent,
        DateRangeComponent,
        DrawerComponent,
        HighlightComponent,
        MessageComponent,
        NavigationComponent,
        AutogrowComponent,
        ScrollbarComponent,
        ScrollResetComponent,
        ConfigComponent,
        SplashScreenComponent,
        MediaWatcherComponent,
        FindByKeyComponent,
        MustMatchComponent
    ],
    imports: [
        RouterModule.forChild(coreFeaturesRoutes),
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatTabsModule,
        MatTreeModule,
        TreoCardModule,
        TreoDateRangeModule,
        TreoDrawerModule,
        TreoHighlightModule,
        TreoMessageModule,
        TreoNavigationModule,
        TreoScrollResetModule,
        SharedModule,
    ]
})
export class CoreFeaturesModule
{
}
