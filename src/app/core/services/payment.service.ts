import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Payment } from '../models';

@Injectable({ providedIn: 'root' })
export class PaymentService extends CrudService<Payment> {
  protected override endpoint = 'payment';
}
