import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TreoNavigationModule } from '@treo/components/navigation/navigation.module';
import { DemoSidebarContentComponent } from 'app/modules/admin/ui/content-layouts/common/demo-sidebar-content/demo-sidebar-content.component';

@NgModule({
    declarations: [
        DemoSidebarContentComponent
    ],
    imports     : [
        RouterModule.forChild([]),
        MatIconModule,
        MatProgressBarModule,
        TreoNavigationModule
    ],
    exports     : [
        DemoSidebarContentComponent
    ]
})
export class DemoSidebarContentModule
{
}
