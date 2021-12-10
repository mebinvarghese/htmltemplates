import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'app/shared/shared.module';
import { DemoContentModule } from 'app/modules/admin/ui/content-layouts/common/demo-content/demo-content.module';
import { DemoSidebarContentModule } from 'app/modules/admin/ui/content-layouts/common/demo-sidebar-content/demo-sidebar-content.module';
import { RightSidebarFullheightTabsComponent } from 'app/modules/admin/ui/content-layouts/right-sidebar/fullheight/tabs/tabs.component';
import { rightSidebarFullheightTabsRoutes } from 'app/modules/admin/ui/content-layouts/right-sidebar/fullheight/tabs/tabs.routing';

@NgModule({
    declarations: [
        RightSidebarFullheightTabsComponent
    ],
    imports     : [
        RouterModule.forChild(rightSidebarFullheightTabsRoutes),
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        MatTabsModule,
        SharedModule,
        DemoContentModule,
        DemoSidebarContentModule
    ]
})
export class RightSidebarFullheightTabsModule
{
}
