import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'app/shared/shared.module';
import { DemoContentModule } from 'app/modules/admin/ui/content-layouts/common/demo-content/demo-content.module';
import { DemoSidebarContentModule } from 'app/modules/admin/ui/content-layouts/common/demo-sidebar-content/demo-sidebar-content.module';
import { RightSidebarContentTabsNavigationComponent } from 'app/modules/admin/ui/content-layouts/right-sidebar/content/tabs-navigation/tabs-navigation.component';
import { RightSidebarContentTabsNavigationTab1Component } from 'app/modules/admin/ui/content-layouts/right-sidebar/content/tabs-navigation/tabs/tab-1/tab-1.component';
import { RightSidebarContentTabsNavigationTab2Component } from 'app/modules/admin/ui/content-layouts/right-sidebar/content/tabs-navigation/tabs/tab-2/tab-2.component';
import { RightSidebarContentTabsNavigationTab3Component } from 'app/modules/admin/ui/content-layouts/right-sidebar/content/tabs-navigation/tabs/tab-3/tab-3.component';
import { rightSidebarContentTabsNavigationRoutes } from 'app/modules/admin/ui/content-layouts/right-sidebar/content/tabs-navigation/tabs-navigation.routing';

@NgModule({
    declarations: [
        RightSidebarContentTabsNavigationComponent,
        RightSidebarContentTabsNavigationTab1Component,
        RightSidebarContentTabsNavigationTab2Component,
        RightSidebarContentTabsNavigationTab3Component
    ],
    imports     : [
        RouterModule.forChild(rightSidebarContentTabsNavigationRoutes),
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatMenuModule,
        MatTabsModule,
        SharedModule,
        DemoContentModule,
        DemoSidebarContentModule
    ]
})
export class RightSidebarContentTabsNavigationModule
{
}
