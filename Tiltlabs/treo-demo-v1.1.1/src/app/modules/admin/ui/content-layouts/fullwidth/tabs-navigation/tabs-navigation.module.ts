import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'app/shared/shared.module';
import { DemoContentModule } from 'app/modules/admin/ui/content-layouts/common/demo-content/demo-content.module';
import { FullwidthTabsNavigationComponent } from 'app/modules/admin/ui/content-layouts/fullwidth/tabs-navigation/tabs-navigation.component';
import { FullwidthTabsNavigationTab1Component } from 'app/modules/admin/ui/content-layouts/fullwidth/tabs-navigation/tabs/tab-1/tab-1.component';
import { FullwidthTabsNavigationTab2Component } from 'app/modules/admin/ui/content-layouts/fullwidth/tabs-navigation/tabs/tab-2/tab-2.component';
import { FullwidthTabsNavigationTab3Component } from 'app/modules/admin/ui/content-layouts/fullwidth/tabs-navigation/tabs/tab-3/tab-3.component';
import { fullwidthTabsNavigationRoutes } from 'app/modules/admin/ui/content-layouts/fullwidth/tabs-navigation/tabs-navigation.routing';

@NgModule({
    declarations: [
        FullwidthTabsNavigationComponent,
        FullwidthTabsNavigationTab1Component,
        FullwidthTabsNavigationTab2Component,
        FullwidthTabsNavigationTab3Component
    ],
    imports     : [
        RouterModule.forChild(fullwidthTabsNavigationRoutes),
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatTabsModule,
        SharedModule,
        DemoContentModule
    ]
})
export class FullwidthTabsNavigationModule
{
}
