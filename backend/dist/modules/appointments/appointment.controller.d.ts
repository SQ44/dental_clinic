import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentController {
    private readonly appointmentService;
    constructor(appointmentService: AppointmentService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<import("./appointment.entity").Appointment>;
    findAll(): Promise<import("./appointment.entity").Appointment[]>;
    findOne(id: number): Promise<import("./appointment.entity").Appointment>;
    update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<import("./appointment.entity").Appointment>;
    remove(id: number): Promise<void>;
}
