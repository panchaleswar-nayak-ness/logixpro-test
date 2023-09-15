import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'custumGrpAllowedSearch'
})
export class SearchPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (!args) {
            
            return value;
        }
        return value.filter((val) => {
            let rVal = (val.groupName.includes(args));
            return rVal;
        })

    }

}