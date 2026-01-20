import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [UsersModule, AuthModule, PrometheusModule.register()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
