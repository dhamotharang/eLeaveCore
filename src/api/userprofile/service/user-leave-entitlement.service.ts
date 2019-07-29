import { Injectable } from '@nestjs/common';
import { UserLeaveEntitlementDbService } from '../db/user-leave-entitlement.db.service';
import { UserLeaveEntitlementSummaryDbService } from '../db/user-leave-summary.db.service';
import { AssignLeavePolicyDTO } from '../dto/leave-entitlement/assign-leave-policy.dto';
import { UserprofileDbService } from '../db/userprofile.db.service';
import { map, filter, switchMap, mergeMap } from 'rxjs/operators';
import { LeavetypeEntitlementDbService } from 'src/admin/leavetype-entitlement/db/leavetype-entitlement.db.service';
import { UserLeaveEntitlementModel } from '../model/user-leave-entitlement.model';
import { v1 } from 'uuid';
import { LeaveTypeEntitlementModel } from 'src/admin/leavetype-entitlement/model/leavetype_entitlement.model';
import { Resource } from 'src/common/model/resource.model';
import { IDbService } from 'src/interface/IDbService';
import * as moment from 'moment';
import { of } from 'rxjs';
import { UserInfoService } from 'src/admin/user-info/user-info.service';
import { UserInfoModel } from 'src/admin/user-info/model/user-info.model';
import { ServiceYearCalc } from 'src/common/policy/entitlement-type/services/service-year-calculation-service/serviceYearCalc.service';
import { ProratedDateEndYearService } from 'src/common/policy/entitlement-type/services/leave-entitlement-type/proratedDateEndYear.service';
import { ProratedDateCurrentMonthService } from 'src/common/policy/entitlement-type/services/leave-entitlement-type/proratedDateCurrentMonth.service';
import { XMLParserService } from 'src/common/helper/xml-parser.service';

/**
 * Service for user leave entitlement
 *
 * @export
 * @class UserLeaveEntitlementService
 */
@Injectable()
export class UserLeaveEntitlementService {

    /**
     *Creates an instance of UserLeaveEntitlementService.
     * @param {UserLeaveEntitlementSummaryDbService} userLeaveEntitlementSummaryDbService
     * @param {UserLeaveEntitlementDbService} userLeaveEntitlementDbService
     * @param {UserprofileDbService} userDbService
     * @param {LeavetypeEntitlementDbService} leaveEntitlementDbService
     * @param {UserInfoService} userInfoDbService
     * @param {ServiceYearCalc} serviceYearCalcService
     * @param {ProratedDateEndYearService} proratedMonthEndYearService
     * @param {XMLParserService} xmlParserService
     * @memberof UserLeaveEntitlementService
     */
    constructor(
        private readonly userLeaveEntitlementSummaryDbService: UserLeaveEntitlementSummaryDbService,
        private readonly userLeaveEntitlementDbService: UserLeaveEntitlementDbService,
        private readonly userDbService: UserprofileDbService,
        private readonly leaveEntitlementDbService: LeavetypeEntitlementDbService,
        private readonly userInfoDbService: UserInfoService,
        private readonly serviceYearCalcService: ServiceYearCalc,
        private readonly proratedMonthEndYearService: ProratedDateEndYearService,
        // private readonly proratedMonthCurrentMonthService: ProratedDateCurrentMonthService,
        private readonly xmlParserService: XMLParserService
    ) { }

    /**
     * Method get entitlement list
     *
     * @param {string} tenantId
     * @param {string} userId
     * @returns
     * @memberof UserLeaveEntitlementService
     */
    public getEntitlementList(tenantId: string, userId: string) {
        const userFilter = ['(USER_GUID=' + userId + ')', '(TENANT_GUID=' + tenantId + ')'];
        const fields = ['LEAVE_TYPE_GUID', 'LEAVE_CODE', 'ENTITLED_DAYS', 'TOTAL_APPROVED', 'TOTAL_PENDING', 'BALANCE_DAYS'];

        return this.userLeaveEntitlementSummaryDbService.findByFilterV2(fields, userFilter);
    }

    // in one time, only 1 policy can active for each type of main leave
    /**
     * Method to assign entitlement
     * In one time, only 1 policy can active for each type of main leave
     *
     * @param {*} user
     * @param {AssignLeavePolicyDTO} data
     * @returns
     * @memberof UserLeaveEntitlementService
     */
    public assignEntitlement(user: any, data: AssignLeavePolicyDTO) {

        //check if the user belong to this tenant
        const userFilter = ['(USER_GUID IN (' + data.userId + '))', '(TENANT_GUID=' + user.TENANT_GUID + ')']

        return this.dbSearch(this.userDbService, userFilter)
            .pipe(
                filter(x => x != null),
                switchMap(() => {
                    //check if current leavetype has active policy
                    const userEntitlementFilter = [
                        '(TENANT_GUID=' + user.TENANT_GUID + ')', '(ENTITLEMENT_GUID=' + data.leaveEntitlementId + ')',
                        '(LEAVE_TYPE_GUID=' + data.leaveTypeId + ')', '(USER_GUID IN (' + data.userId + '))', '(ACTIVE_FLAG=1)'
                    ]

                    const dataTemp = this.dbSearch(this.userLeaveEntitlementDbService, userEntitlementFilter);

                    return dataTemp;

                }),
                filter(x => x == null),
                switchMap(() => {

                    // check if combination of main leave and entitlement def exist
                    const entitlementFilter = [
                        '(TENANT_GUID=' + user.TENANT_GUID + ')', '(ENTITLEMENT_GUID=' + data.leaveEntitlementId + ')',
                        '(LEAVE_TYPE_GUID=' + data.leaveTypeId + ')', '(ACTIVE_FLAG=true)'
                    ];

                    return this.dbSearch(this.leaveEntitlementDbService, entitlementFilter);
                }),
                filter(x => x != null),
                mergeMap((res: LeaveTypeEntitlementModel) => {

                    const userInfoFilter = ['(TENANT_GUID=' + user.TENANT_GUID + ')', '(USER_GUID IN (' + data.userId + '))']
                    // console.log(userInfoFilter);
                    return this.dbSearch(this.userInfoDbService, userInfoFilter)
                        .pipe(map((userInfoResult) => {
                            // console.log(res);
                            return { res, userInfoResult }
                        }))
                }),
                mergeMap((res) => {
                    // console.log(res.res);
                    return this.assignPolicyProcess(res, user, data);

                })
            )

    }

    /**
     * Method assign policy process
     *
     * @param {*} res
     * @param {*} user
     * @param {*} data
     * @returns
     * @memberof UserLeaveEntitlementService
     */
    public assignPolicyProcess(res, user, data) {

        // console.log('here' + res);
        // console.log(user);
        // console.log(data);

        const { length } = data.userId;
        const resource = new Resource(new Array());

        // console.log(length);
        for (let i = 0; i < length; i++) {
            // console.log(data.userId[i]);
            const user = res.userInfoResult.find(x => x.USER_GUID.toString() === data.userId[i].toString());
            // console.log(user);
            const dateOfJoin = new Date(user.JOIN_DATE);
            // get the service year
            const serviceYear = this.serviceYearCalcService.calculateEmployeeServiceYear(dateOfJoin);
            // console.log('svc-year' + serviceYear);

            // console.log(res.res[0].PROPERTIES_XML);

            const policy = this.xmlParserService.convertXMLToJson(res.res[0].PROPERTIES_XML);
            // console.log('pol' + policy);


            //get the entitlement days
            const entitlementDay = this.proratedMonthEndYearService.calculateEntitledLeave(dateOfJoin, serviceYear, policy);
            // console.log('ed' + entitlementDay);

            if (entitlementDay == 0 || entitlementDay == undefined) {
                return of(null);
            }

            // assign new policy to user
            const entitlementModel = new UserLeaveEntitlementModel();
            entitlementModel.USER_LEAVE_ENTITLEMENT_GUID = v1();
            entitlementModel.LEAVE_TYPE_GUID = data.leaveTypeId;
            entitlementModel.ENTITLEMENT_GUID = data.leaveEntitlementId;
            entitlementModel.USER_GUID = data.userId[i];

            entitlementModel.PARENT_FLAG = 1;
            entitlementModel.CF_FLAG = 0;
            entitlementModel.PROPERTIES_XML = res.res[0].PROPERTIES_XML;
            entitlementModel.YEAR = moment().year();
            entitlementModel.REMARKS = null;
            entitlementModel.ACTIVE_FLAG = 1;

            entitlementModel.TENANT_GUID = user.TENANT_GUID;
            entitlementModel.CREATION_USER_GUID = user.USER_GUID;

            entitlementModel.DAYS_ADDED = entitlementDay;



            resource.resource.push(entitlementModel);

        }

        // console.log(resource);

        // const dateOfJoin = new Date(res.userInfoResult.JOIN_DATE);
        // // get the service year
        // const serviceYear = this.serviceYearCalcService.calculateEmployeeServiceYear(dateOfJoin);

        // const policy = this.xmlParserService.convertXMLToJson(res.res.PROPERTIES_XML);

        // // //get the entitlement days
        // const entitlementDay = this.proratedMonthEndYearService.calculateEntitledLeave(dateOfJoin, serviceYear, policy);

        // if (entitlementDay == 0 || entitlementDay == undefined) {
        //     return of(null);
        // }

        // // assign new policy to user
        // const entitlementModel = new UserLeaveEntitlementModel();
        // entitlementModel.USER_LEAVE_ENTITLEMENT_GUID = v1();
        // entitlementModel.LEAVE_TYPE_GUID = data.leaveTypeId;
        // entitlementModel.ENTITLEMENT_GUID = data.leaveEntitlementId;
        // entitlementModel.USER_GUID = data.userId;

        // entitlementModel.PARENT_FLAG = 1;
        // entitlementModel.CF_FLAG = 0;
        // entitlementModel.PROPERTIES_XML = res.res.PROPERTIES_XML;
        // entitlementModel.YEAR = moment().year();
        // entitlementModel.REMARKS = 'this is remark';
        // entitlementModel.ACTIVE_FLAG = 1;

        // entitlementModel.TENANT_GUID = user.TENANT_GUID;
        // entitlementModel.CREATION_USER_GUID = user.USER_GUID;

        // entitlementModel.DAYS_ADDED = entitlementDay;

        // const resource = new Resource(new Array());

        // resource.resource.push(entitlementModel);

        return this.userLeaveEntitlementDbService.createByModel(resource, [], [], [])
            .pipe(map(res => {
                if (res.status == 200) {
                    return res.data.resource;
                }
            }))
    }

    /**
     * Method db search
     *
     * @private
     * @param {IDbService} IDbService
     * @param {string[]} filter
     * @returns
     * @memberof UserLeaveEntitlementService
     */
    private dbSearch(IDbService: IDbService, filter: string[]) {
        return IDbService.findByFilterV2([], filter)
            .pipe(
                map(res => {
                    if (res.length > 0) {
                        return res;
                    }

                })
            )
    }
}