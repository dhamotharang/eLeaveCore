import { Module, HttpModule } from '@nestjs/common';
import { CostcentreService } from './costcentre.service';
import { CostcentreController } from './costcentre.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { DreamFactory } from 'src/config/dreamfactory';

@Module({
  controllers: [
    CostcentreController
  ],
  modules:[
    AuthModule,
    PassportModule.register({session: false}),
    HttpModule.register({headers:{'Content-Type':'application/json','X-Dreamfactory-API-Key':DreamFactory.df_key}})
  ],    
  providers: [
    CostcentreService
  ]
})
export class CostcentreModule {}
