import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService], // <-- Ajout ici
  exports: [UsersService], // Utile pour le module Auth plus tard
})
export class UsersModule {}
