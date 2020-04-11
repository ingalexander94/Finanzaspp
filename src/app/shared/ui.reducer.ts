import * as FormUI from './ui.actions';

export interface State {
    isLoading: boolean;
};

const estadoInicial: State = {
    isLoading : false
};

export const uiReducer = (state = estadoInicial, actions: FormUI.acciones):State => {

    switch (actions.type) {

        case FormUI.ACTIVAR_LOADING:
            return {
                isLoading: true
            };

        case FormUI.DESACTIVAR_LOADING:
            return {
                isLoading: false
            };
    
        default:
            return state;
    }

}