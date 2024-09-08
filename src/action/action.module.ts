import { Module } from '@nestjs/common';
import { ActionService } from './action.service';

@Module({
  imports: [

  ],
  providers: [
    ActionService
  ],
})
export class ActionModule {
}
