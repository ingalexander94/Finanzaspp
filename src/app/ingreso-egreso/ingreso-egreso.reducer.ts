
import * as FromIE from './ingreso-egreso.actions';
import { IngresoEgreso } from './ingreso-egreso.model';

export interface IngresoEgresoState {
    items: IngresoEgreso[];
}

const estadoIncial: IngresoEgresoState = {
    items: []
}

export const ingresoEgresoReducer = (state = estadoIncial, action: FromIE.acciones): IngresoEgresoState => {

    switch (action.type) {

        case FromIE.SET_ITEM:
            return {
                items: [
                    ...action.items.map(item => {
                        return { ...item };
                    })
                ]
            };

        case FromIE.UNSET_ITEM:
            return {
                items: []
            };

        default:
            return state;

    }
}