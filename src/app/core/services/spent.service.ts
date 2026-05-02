import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Spent } from '../models';

@Injectable({ providedIn: 'root' })
export class SpentService extends CrudService<Spent> {
  protected override endpoint = 'spent';
}
