import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dentist } from './dentist.entity';

@Injectable()
export class DentistService {
  constructor(
    @InjectRepository(Dentist)
    private readonly dentistRepository: Repository<Dentist>,
  ) {}

  findAll(): Promise<Dentist[]> {
    return this.dentistRepository.find({
      order: {
        lastName: 'ASC',
        firstName: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Dentist> {
    const dentist = await this.dentistRepository.findOne({ where: { id } });
    if (!dentist) {
      throw new NotFoundException(`Dentist with ID ${id} not found`);
    }
    return dentist;
  }
}
