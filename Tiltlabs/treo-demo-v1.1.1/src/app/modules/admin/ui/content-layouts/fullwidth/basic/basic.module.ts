import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from 'app/shared/shared.module';
import { DemoContentModule } from 'app/modules/admin/ui/content-layouts/common/demo-content/demo-content.module';
import { FullwidthBasicComponent } from 'app/modules/admin/ui/content-layouts/fullwidth/basic/basic.component';
import { fullwidthBasicRoutes } from 'app/modules/admin/ui/content-layouts/fullwidth/basic/basic.routing';

@NgModule({
    declarations: [
        FullwidthBasicComponent
    ],
    imports     : [
        RouterModule.forChild(fullwidthBasicRoutes),
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        SharedModule,
        DemoContentModule
    ]
})
export class FullwidthBasicModule
{
}
