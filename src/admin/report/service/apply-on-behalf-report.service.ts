import { Injectable } from '@nestjs/common';
import { ReportDBService } from './report-db.service';
import { map, mergeMap } from 'rxjs/operators';
import { ApplyOnBehalfReportDto } from '../dto/apply-on-behalf-report.dto';
import { PendingLeaveService } from 'src/admin/approval-override/pending-leave.service';
import { getEmployeeServiceYear } from 'src/common/helper/basic-functions';

@Injectable()
export class ApplyOnBehalfReportService {
  constructor(private readonly reportDBService: ReportDBService,
    private readonly pendingLeaveService: PendingLeaveService) { }
  getApplyOnBehalfData([tenantId, userId]: [string, string]) {
    let filter = [`(APPLIED_ON_BEHALF=1)`, `(TENANT_GUID=${tenantId})`];
    const extra = ['(USER_GUID=' + userId + ')'];
    filter = userId != null ? filter.concat(extra) : filter;

    return this.reportDBService.leaveTransactionDbService.findByFilterV2([], filter).pipe(
      mergeMap(async res => {
        let leaveTypeList = await this.pendingLeaveService.getLeavetypeList(res[0].TENANT_GUID) as any[];
        let resultAll = await this.pendingLeaveService.getAllUserInfo(res[0].TENANT_GUID) as any[];
        return { res, resultAll, leaveTypeList };
      }),
      map(result => {
        let { res, resultAll, leaveTypeList } = result;
        let userIdList = [];
        res.forEach(element => {
          let resultUser = resultAll.find(x => x.USER_GUID === element.USER_GUID);
          let findLeaveData = leaveTypeList.find(x => x.LEAVE_TYPE_GUID === element.LEAVE_TYPE_GUID);

          let applyOnBehalfReportDto = new ApplyOnBehalfReportDto;

          applyOnBehalfReportDto.userGuid = element.USER_GUID;
          applyOnBehalfReportDto.employeeNo = resultUser.STAFF_ID;
          applyOnBehalfReportDto.employeeName = resultUser.FULLNAME;
          applyOnBehalfReportDto.yearService = getEmployeeServiceYear(resultUser.JOIN_DATE);
          applyOnBehalfReportDto.leaveTypeId = element.LEAVE_TYPE_GUID;
          applyOnBehalfReportDto.leaveTypeName = findLeaveData.CODE;
          applyOnBehalfReportDto.applicationDate = element.CREATION_TS;
          applyOnBehalfReportDto.confirmedDate = element.UPDATE_TS;
          applyOnBehalfReportDto.appliedBy = element.UPDATE_USER_GUID;
          applyOnBehalfReportDto.startDate = element.START_DATE;
          applyOnBehalfReportDto.endDate = element.END_DATE;
          applyOnBehalfReportDto.noOfDays = element.NO_OF_DAYS;
          applyOnBehalfReportDto.status = element.STATUS;
          applyOnBehalfReportDto.remarks = element.REMARKS;

          userIdList.push(applyOnBehalfReportDto);
        });

        return userIdList;
      })
    )
  }
}