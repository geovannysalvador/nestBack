

export interface JwtPayload{

    id:string;
    // Fecaha de creacion
    iat?:number;
    // Fecha de expiracion
    exp?:number;
}

