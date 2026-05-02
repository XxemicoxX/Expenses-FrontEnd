import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Income } from '../models';

@Injectable({ providedIn: 'root' })
export class IncomeService extends CrudService<Income> {
  protected override endpoint = 'income';
}
