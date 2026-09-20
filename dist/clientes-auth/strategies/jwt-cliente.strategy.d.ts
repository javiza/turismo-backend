import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtClientePayload } from '../interfaces/jwt-cliente-payload.interface';
import { ClientesService } from '../../clientes/clientes.service';
declare const JwtClienteStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtClienteStrategy extends JwtClienteStrategy_base {
    private readonly clientesService;
    constructor(configService: ConfigService, clientesService: ClientesService);
    validate(payload: JwtClientePayload): Promise<JwtClientePayload>;
}
export {};
