import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { CloudinaryService } from '../storage/cloudinary.service';
export declare class ProveedoresController {
    private readonly proveedoresService;
    private readonly cloudinary;
    constructor(proveedoresService: ProveedoresService, cloudinary: CloudinaryService);
    create(dto: CreateProveedorDto): Promise<import("./entities/proveedor.entity").Proveedor>;
    subirImagen(archivo: Express.Multer.File): Promise<import("../storage/cloudinary.service").ImagenSubida>;
    findAll(): Promise<import("./entities/proveedor.entity").Proveedor[]>;
    contarNoLeidos(): Promise<{
        count: number;
    }>;
    findOne(id: string): Promise<import("./entities/proveedor.entity").Proveedor>;
    update(id: string, dto: UpdateProveedorDto): Promise<import("./entities/proveedor.entity").Proveedor>;
    remove(id: string): Promise<void>;
}
