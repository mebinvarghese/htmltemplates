import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'app/shared/shared.module';
import { DemoContentModule } from 'app/modules/admin/ui/content-layouts/common/demo-content/demo-content.module';
import { FullwidthTabsComponent } from 'app/modules/admin/ui/content-layouts/fullwidth/tabs/tabs.component';
import { fullwidthTabsRoutes } from 'app/modules/admin/ui/content-layouts/fullwidth/tabs/tabs.routing';

@NgModule({
    declarations: [
        FullwidthTabsComponent
    ],
    imports     : [
        RouterModule.forChild(fullwidthTabsRoutes),
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatTabsModule,
        SharedModule,
        DemoContentModule
    ]
})
export class FullwidthTabsModule
{
}
