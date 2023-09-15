import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'customFuncAllowedSearch'
})
export class customFuncAllowedSearch implements PipeTransform {

    transform(value: any, args?: any): any {
        if (!args) {
            
            return value;
        }
        return value.filter((val) => {
            let rVal = (val.includes(args));
            return rVal;
        })

    }

}