import { PaquetesService } from './paquetes.service';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';
import { AgregarImagenDto } from '../common/dto/agregar-imagen.dto';
export declare class PaquetesController {
    private readonly paquetesService;
    constructor(paquetesService: PaquetesService);
    findAll(): Promise<import("./entities/paquete.entity").Paquete[]>;
    buscar(q: string): Promise<import("./entities/paquete.entity").Paquete[]>;
    findAllAdmin(): Promise<import("./entities/paquete.entity").Paquete[]>;
    findOne(id: string): Promise<import("./entities/paquete.entity").Paquete>;
    create(dto: CreatePaqueteDto): Promise<import("./entities/paquete.entity").Paquete>;
    update(id: string, dto: UpdatePaqueteDto): Promise<import("./entities/paquete.entity").Paquete>;
    remove(id: string): Promise<void>;
    agregarImagen(id: string, dto: AgregarImagenDto): Promise<import("./entities/paquete-imagen.entity").PaqueteImagen>;
    eliminarImagen(id: string, imagenId: string): Promise<void>;
    marcarImagenPrincipal(id: string, imagenId: string): Promise<import("./entities/paquete-imagen.entity").PaqueteImagen>;
}
