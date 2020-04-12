

export type tiposPermitidos = "Ingreso" |
    "Egreso";

export class IngresoEgreso {

    public uid?: string;

    constructor(public descripcion: string, public monto: number, public tipo: tiposPermitidos) {
    }

}