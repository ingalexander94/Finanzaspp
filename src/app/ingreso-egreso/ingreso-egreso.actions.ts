import { Action } from '@ngrx/store';
import { IngresoEgreso } from './ingreso-egreso.model';


export const SET_ITEM = "[INGRESO-EGRESO] Set item ";
export const UNSET_ITEM = "[INGRESO-EGRESO] UnSet item ";

export class SetItemAction implements Action {
    readonly type = SET_ITEM;
    constructor(public items: IngresoEgreso[]){}
}

export class UnSetItemAction implements Action {
    readonly type = UNSET_ITEM;
}

export type acciones = SetItemAction    |
                       UnSetItemAction;