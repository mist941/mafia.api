import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActionService {

  constructor(private prisma: PrismaService) {

  }
}