import { Module, HttpModule } from '@nestjs/common';
import { LeavetypeEntitlementController } from './leavetype-entitlement.controller';
import { LeavetypeEntitlementDbService } from './db/leavetype-entitlement.db.service';
import { DreamFactory } from 'src/config/dreamfactory';
// import { AuthModule } from 'src/auth/auth.module';
// import { PassportModule } from '@nestjs/passport';
import { QueryParserService } from 'src/common/helper/query-parser.service';
import { LeaveTypeEntitlementService } from './leavetype-entitlement.service';
import { CommonFunctionService } from 'src/common/helper/common-function.services';
import { getModuleHttp } from '../../common/helper/basic-functions';

/**
 * Module for leavetype entitlement
 *
 * @export
 * @class LeavetypeEntitlementModule
 */
@Module({
  controllers: [LeavetypeEntitlementController],
  imports: [
    // AuthModule,
    // PassportModule.register({ session: false }),
    // HttpModule.register({ headers: { 'Content-Type': 'application/json', 'X-Dreamfactory-API-Key': DreamFactory.df_key } })
    getModuleHttp()
  ],
  providers: [
    LeaveTypeEntitlementService,
    LeavetypeEntitlementDbService,
    QueryParserService,
    CommonFunctionService
  ]
})
export class LeavetypeEntitlementModule { }
