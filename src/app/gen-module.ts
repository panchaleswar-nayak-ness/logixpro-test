import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ActionDisableDirective } from './init/action-disable.directive';
import { NumbersOnlyDirective } from './init/NumbersOnly.directive';
import { SortDirective } from './init/sort.directive';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    exports: [
        NgScrollbarModule,
        RouterModule,
        FormsModule, 
        HttpClientModule,
        ReactiveFormsModule,
        NumbersOnlyDirective,
        MatTooltipModule, 
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