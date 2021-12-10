import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { DemoContentModule } from 'app/modules/admin/ui/content-layouts/common/demo-content/demo-content.module';
import { DemoSidebarContentModule } from 'app/modules/admin/ui/content-layouts/common/demo-sidebar-content/demo-sidebar-content.module';
import { LeftSidebarFullheightStandardComponent } from 'app/modules/admin/ui/content-layouts/left-sidebar/fullheight/standard/standard.component';
import { leftSidebarFullheightStandardRoutes } from 'app/modules/admin/ui/content-layouts/left-sidebar/fullheight/standard/standard.routing';

@NgModule({
    declarations: [
        LeftSidebarFullheightStandardComponent
    ],
    imports     : [
        RouterModule.forChild(leftSidebarFullheightStandardRoutes),
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        SharedModule,
        DemoContentModule,
        DemoSidebarContentModule,
    ]
})
export class LeftSidebarFullheightStandardModule
{
}
