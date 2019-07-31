import { Module, HttpModule } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { LeaveAdjustmentService } from './leave-adjustment.service';
import { QueryParserService } from 'src/common/helper/query-parser.service';
import { CommonFunctionService } from 'src/common/helper/common-function.services';
import { XMLParserService } from 'src/common/helper/xml-parser.service';
import { LeaveAdjustmentController } from './leave-adjustment.controller';
import { DreamFactory } from 'src/config/dreamfactory';
import { UserLeaveEntitlementDbService } from 'src/api/userprofile/db/user-leave-entitlement.db.service';

@Module({
  modules: [
    AuthModule,
    PassportModule.register({ session: false }),
    HttpModule.register({ headers: { 'Content-Type': 'application/json', 'X-Dreamfactory-API-Key': DreamFactory.df_key } })
  ],
  providers: [
    LeaveAdjustmentService,
    QueryParserService,
    CommonFunctionService,
    XMLParserService,
    UserLeaveEntitlementDbService
  ],
  controllers: [LeaveAdjustmentController]
})
export class LeaveAdjustmentModule { }