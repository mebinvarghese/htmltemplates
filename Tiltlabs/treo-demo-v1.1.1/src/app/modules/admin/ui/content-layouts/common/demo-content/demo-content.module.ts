import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DemoContentComponent } from 'app/modules/admin/ui/content-layouts/common/demo-content/demo-content.component';

@NgModule({
    declarations: [
        DemoContentComponent
    ],
    imports     : [
        RouterModule.forChild([])
    ],
    exports     : [
        DemoContentComponent
    ]
})
export class DemoContentModule
{
}
