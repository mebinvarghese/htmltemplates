import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from 'app/shared/shared.module';
import { DemoContentModule } from 'app/modules/admin/ui/content-layouts/common/demo-content/demo-content.module';
import { FullwidthStandardComponent } from 'app/modules/admin/ui/content-layouts/fullwidth/standard/standard.component';
import { fullwidthStandardRoutes } from 'app/modules/admin/ui/content-layouts/fullwidth/standard/standard.routing';

@NgModule({
    declarations: [
        FullwidthStandardComponent
    ],
    imports     : [
        RouterModule.forChild(fullwidthStandardRoutes),
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        SharedModule,
        DemoContentModule
    ]
})
export class FullwidthStandardModule
{
}
