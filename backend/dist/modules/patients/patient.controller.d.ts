import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
export declare class PatientController {
    private readonly patientService;
    constructor(patientService: PatientService);
    create(createPatientDto: CreatePatientDto): Promise<import("./patient.entity").Patient>;
    findAll(): Promise<import("./patient.entity").Patient[]>;
    findOne(id: number): Promise<import("./patient.entity").Patient>;
    update(id: number, updatePatientDto: UpdatePatientDto): Promise<import("./patient.entity").Patient>;
    remove(id: number): Promise<void>;
}
