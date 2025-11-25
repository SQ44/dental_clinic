import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DentistService } from './dentist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dentists')
@UseGuards(JwtAuthGuard)
export class DentistController {
  constructor(private readonly dentistService: DentistService) {}

  @Get()
  findAll() {
    return this.dentistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dentistService.findOne(id);
  }
}
