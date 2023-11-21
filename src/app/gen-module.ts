import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ActionDisableDirective } from './common/init/action-disable.directive';
import { NumbersOnlyDirective } from './common/init/NumbersOnly.directive';
import { SortDirective } from './common/init/sort.directive';

@NgModule({
    exports: [
        NgScrollbarModule,
        RouterModule,
        FormsModule, 
        HttpClientModule,
        ReactiveFormsModule,
        NumbersOnlyDirective,
        ActionDisableDirective,
        SortDirective
    ],
    declarations: [
        NumbersOnlyDirective,
        ActionDisableDirective,
        SortDirective
      ],
})
export class GeneralModule { }