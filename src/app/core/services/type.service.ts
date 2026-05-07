import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { IncomeType } from '../models';

@Injectable({ providedIn: 'root' })
export class TypeService extends CrudService<IncomeType> {
  protected override endpoint = 'type';
}
