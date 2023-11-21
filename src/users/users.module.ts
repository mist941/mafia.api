import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AppResolver } from '../app.resolver';

@Module({
  providers: [
    UsersService,
    AppResolver
  ],
})
export class UsersModule {
}
