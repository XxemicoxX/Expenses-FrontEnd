import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Categorie } from '../models';

@Injectable({ providedIn: 'root' })
export class CategorieService extends CrudService<Categorie> {
  protected override endpoint = 'categorie';
}
