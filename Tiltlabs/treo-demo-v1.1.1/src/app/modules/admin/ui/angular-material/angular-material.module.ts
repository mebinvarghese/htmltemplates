import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { AngularMaterialComponent } from 'app/modules/admin/ui/angular-material/angular-material.component';
import { angularMaterialRoutes } from 'app/modules/admin/ui/angular-material/angular-material.routing';

@NgModule({
    declarations: [
        AngularMaterialComponent
    ],
    imports     : [
        RouterModule.forChild(angularMaterialRoutes),
        SharedModule
    ]
})
export class AngularMaterialModule
{
}
