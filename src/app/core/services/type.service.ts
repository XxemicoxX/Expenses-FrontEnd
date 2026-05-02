import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Type } from '../models';

@Injectable({ providedIn: 'root' })
export class TypeService extends CrudService<Type> {
  protected override endpoint = 'type';
}
