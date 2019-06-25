import { BranchController } from './branch.controller';
import { Module, HttpModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DreamFactory } from 'src/config/dreamfactory';
import { AuthModule } from 'src/auth/auth.module';
import { BranchService } from './branch.service';
import { QueryParserService } from 'src/common/helper/query-parser.service';
import { BranchDbService } from './db/branch.db.service';
import { ResultStatusService } from 'src/common/helper/result-status.service';

/**
 * Module for branch
 *
 * @export
 * @class BranchModule
 */
@Module({
    controllers: [BranchController],
    modules:[
        AuthModule,
        PassportModule.register({session: false}),
        HttpModule.register({headers:{'Content-Type':'application/json','X-Dreamfactory-API-Key':DreamFactory.df_key}})
      ],
    providers: [
      BranchDbService,
      BranchService,
      QueryParserService,
      ResultStatusService
    ]
})
export class BranchModule {}
