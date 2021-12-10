import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TreoHighlightModule } from '@treo/components/highlight';
import { TreoMessageModule } from '@treo/components/message';
import { TreoNavigationModule } from '@treo/components/navigation';
import { TreoScrollResetModule } from '@treo/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { OtherComponentsComponent } from 'app/modules/admin/docs/other-components/other-components.component';
import { OverviewComponent } from 'app/modules/admin/docs/other-components/common/overview/overview.component';
import { MessagesComponent } from 'app/modules/admin/docs/other-components/common/messages/messages.component';
import { NotificationsComponent } from 'app/modules/admin/docs/other-components/common/notifications/notifications.component';
import { SearchComponent } from 'app/modules/admin/docs/other-components/common/search/search.component';
import { ShortcutsComponent } from 'app/modules/admin/docs/other-components/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/modules/admin/docs/other-components/common/user/user.component';
import { ApexChartsComponent } from 'app/modules/admin/docs/other-components/third-party/apex-charts/apex-charts.component';
import { FullCalendarComponent } from 'app/modules/admin/docs/other-components/third-party/full-calendar/full-calendar.component';
import { NgxMarkdownComponent } from 'app/modules/admin/docs/other-components/third-party/ngx-markdown/ngx-markdown.component';
import { QuillEditorComponent } from 'app/modules/admin/docs/other-components/third-party/quill-editor/quill-editor.component';
import { otherComponentsRoutes } from 'app/modules/admin/docs/other-components/other-components.routing';

@NgModule({
    declarations: [
        OtherComponentsComponent,
        OverviewComponent,
        MessagesComponent,
        NotificationsComponent,
        SearchComponent,
        ShortcutsComponent,
        UserComponent,
        ApexChartsComponent,
        FullCalendarComponent,
        NgxMarkdownComponent,
        QuillEditorComponent
    ],
    imports     : [
        RouterModule.forChild(otherComponentsRoutes),
        MatSidenavModule,
        TreoHighlightModule,
        TreoMessageModule,
        TreoNavigationModule,
        TreoScrollResetModule,
        SharedModule
    ]
})
export class OtherComponentsModule
{
}
