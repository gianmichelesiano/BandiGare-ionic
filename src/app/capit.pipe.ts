
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'capit'})
export class CapitPipe implements PipeTransform {
  transform(value: string) : string {
  	if (value.length>5) {
	    value = value.toLowerCase();
	    value = value.charAt(0).toUpperCase() + value.slice(1); 
    }
    return value;
  }
}

