import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { DatatableComponent } from 'app/modules/admin/ui/datatable/datatable.component';
import { datatableRoutes } from 'app/modules/admin/ui/datatable/datatable.routing';

@NgModule({
    declarations: [
        DatatableComponent
    ],
    imports     : [
        RouterModule.forChild(datatableRoutes),
        SharedModule
    ]
})
export class DatatableModule
{
}
