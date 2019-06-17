import { Injectable, Res, Req } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { XMLParserService } from 'src/common/helper/xml-parser.service';
import { UserInfoModel } from 'src/admin/user-info/model/user-info.model';
import { UserPersonalDetailDTO } from '../dto/userprofile-detail/personal-detail/user-personal-detail.dto';
import { UserProfileDTO } from '../dto/userprofile-detail/userprofile.dto';
import { EmploymentDetailDTO } from '../dto/userprofile-detail/employment-detail/employment-detail.dto';
import { EntitlementDetailDTO } from '../dto/userprofile-detail/entitlement-detail/entitlement-detail.dto';
import { leaveEntitlementMock } from '../mockdata/leave-entitlement';
import { UserprofileListDTO } from '../dto/userprofile-list/userprofile-list.dto';
import { UserprofileDbService } from '../db/userprofile.db.service';
import { UpdatePersonalDetailDTO } from '../dto/userprofile-detail/personal-detail/update-personal-detail.dto';
import { UserInfoService } from 'src/admin/user-info/user-info.service';
import { Resource } from 'src/common/model/resource.model';
import { PersonalDetailXML } from '../dto/userprofile-detail/personal-detail/xml/personal-detail.xml';
import { UpdateEmploymentDetailDTO } from '../dto/userprofile-detail/employment-detail/update-employment-detail.dto';
import { Access } from 'src/common/dto/access.dto';
import { ServiceYearCalc } from 'src/common/policy/entitlement-type/services/service-year-calculation-service/serviceYearCalc.service';
import { UserLeaveEntitlementModel } from "../model/user-leave-entitlement.model";
import { UserLeaveEntitlementService } from './user-leave-entitlement.service';

/**
 *
 *
 * @export
 * @class UserprofileService
 */
@Injectable()
export class UserprofileService {

    constructor(
        private readonly userInfoService: UserInfoService,
        private readonly userprofileDBService: UserprofileDbService,
        private readonly xmlParserService: XMLParserService,
        private readonly entitlementDetailService: UserLeaveEntitlementService,
        private readonly serviceYearCalcService: ServiceYearCalc) { }

    public getList(filters: string[]) {
        return this.userprofileDBService.findByFilterV2([], filters)
            .pipe(
                map(res => {
                    const userArray = new Array();

                    res.forEach(element => {

                        userArray.push(
                            new UserprofileListDTO(
                                element.USER_INFO_GUID,
                                element.USER_GUID,
                                element.PERSONAL_ID == null ? '' : element.PERSONAL_ID,
                                element.FULLNAME,
                                element.DESIGNATION,
                                element.EMAIL,
                                new Access()
                            ));

                    });

                    return userArray;
                })
            );
    }

    // Get User Detail
    /**
     * usage : userprofile service get by id or own
     *
     * @param {string[]} filters
     * @returns
     * @memberof UserprofileService
     */
    public getDetail(filters: string[]) {
        return this.userInfoService.findByFilterV2([], filters)
            .pipe(
                map(res => {
                    // console.log(res);
                    const data: UserInfoModel = res[0];

                    if (data) {
                        return this.buildProfileData(data, true, true, true, true);
                    }
                })
            )

    }

    //#region PERSONAL DETAIL

    public getPersonalDetail(filters: string[]) {
        return this.userInfoService.findByFilterV2([], filters)
            .pipe(
                map(res => {
                    const data: UserInfoModel = res[0];

                    if (data) {
                        return this.buildProfileData(data, true, false, false, false);
                    }
                })
            );
    }

    public updatePersonalDetail(data: UpdatePersonalDetailDTO, userId: string) {

        const modeldata = new UserInfoModel();
        modeldata.USER_INFO_GUID = data.id;
        modeldata.NICKNAME = data.nickname;
        modeldata.PROPERTIES_XML = this.xmlParserService.convertJsonToXML(data);
        modeldata.UPDATE_TS = new Date().toISOString();
        modeldata.UPDATE_USER_GUID = userId;

        const resource = new Resource(new Array());
        resource.resource.push(modeldata);

        return this.userInfoService.updateByModel(resource, [], [], []);
    }

    //#endregion


    //#region EMPLOYMENT DETAIL

    public getEmploymentDetail(filters: string[]) {
        return this.userInfoService.findByFilterV2([], filters)
            .pipe(
                map(res => {
                    const data: UserInfoModel = res[0];

                    if (data) {
                        return this.buildProfileData(data, false, true, false, false);
                    }
                })
            )
    }

    public updateEmploymentDetail(data: UpdateEmploymentDetailDTO, userId: string) {
        console.log('this is employment update');
        const modelData = new UserInfoModel();

        modelData.USER_INFO_GUID = data.id;

        modelData.PERSONAL_ID = data.employeeNumber;
        modelData.DESIGNATION = data.designation;
        modelData.DEPARTMENT = data.department;
        modelData.BRANCH = data.branch;
        modelData.DIVISION = data.division;
        modelData.MANAGER_USER_GUID = data.reportingTo;

        modelData.JOIN_DATE = data.dateOfJoin;
        modelData.RESIGNATION_DATE = data.dateOfResign;
        modelData.CONFIRMATION_DATE = data.dateOfConfirmation;

        modelData.EMPLOYEE_STATUS = data.employmentStatus;
        modelData.EMPLOYEE_TYPE = data.employmentType;

        modelData.BANK = data.bankAccountName;
        modelData.PR_ACCOUNT_NUMBER = data.bankAccountNumber;
        modelData.PR_EPF_NUMBER = data.epfNumber;
        modelData.PR_INCOMETAX_NUMBER = data.incomeTaxNumber;

        modelData.UPDATE_TS = new Date().toISOString();
        modelData.UPDATE_USER_GUID = userId;

        const resource = new Resource(new Array());

        resource.resource.push(modelData);

        return this.userInfoService.updateByModel(resource, [], [], []);
    }

    //#region ENTITLEMENT DETAIL

    public getEntitlementDetail(tenant_guid, user_guid) {
        return this.entitlementDetailService.getEntitlementList(tenant_guid, user_guid);
    }

    //#endregion


    //#region CERTIFICATION DETAIL

    public getCertificationDetail(filters: string[]) {
        return this.userInfoService.findByFilterV2([], filters)
            .pipe(
                map(res => {
                    const data: UserInfoModel = res[0];

                    if (data) {
                        return this.buildProfileData(data, false, false, false, true);
                    }
                })
            )
    }

    //#endregion

    private buildProfileData(
        data: UserInfoModel,
        isShowPersonalData: boolean,
        isShowEmploymentData: boolean,
        isShowEntitlementData: boolean,
        isShowCertData: boolean) {

        const userProfileData = new UserProfileDTO();

        userProfileData.id = data.USER_INFO_GUID;
        userProfileData.userId = data.USER_GUID;
        userProfileData.employeeName = data.FULLNAME;
        userProfileData.employeeDesignation = data.DESIGNATION;
        userProfileData.employeeLocation = data.TENANT_COMPANY_GUID;
        userProfileData.employeeDepartment = data.DEPARTMENT;
        userProfileData.calendarId = data.CALENDAR_GUID;

        if (data.PROPERTIES_XML) {

            //process the personal detail
            const parseXMLtoJSON: PersonalDetailXML = this.xmlParserService.convertXMLToJson(data.PROPERTIES_XML);

            if (isShowPersonalData) {
                const userPersonalDetail = new UserPersonalDetailDTO();


                // public assignOneData(val:any,dataModel:any){
                // let inputData = new dataModel;
                for (var j in parseXMLtoJSON) {
                    var sub_key = j;
                    var sub_val = parseXMLtoJSON[j];
                    // let lwrCseKey = sub_key.toLowerCase();
                    if (sub_key == 'gender') { sub_val = sub_val == 1 ? 'Male' : 'Female'; }
                    if (sub_key == 'maritalStatus') { sub_val = sub_val == 1 ? 'Married' : 'Single'; }
                    if (sub_key == 'address1') { sub_key = 'residentialAddress1'; }
                    if (sub_key == 'address2') { sub_key = 'residentialAddress2'; }
                    if (sub_key == 'emergencyContact') { sub_key = 'emergencyContactNumber'; }
                    if (sub_key == 'id') { continue; }
                    userPersonalDetail[sub_key] = sub_val;
                    // console.log(sub_key + " - " + sub_val);
                }
                // return inputData;
                // }

                // userPersonalDetail.dob = parseXMLtoJSON.dob;
                // userPersonalDetail.nric = parseXMLtoJSON.nric;
                // userPersonalDetail.nickname = parseXMLtoJSON.nickname;
                // userPersonalDetail.emailAddress = parseXMLtoJSON.emailAddress;
                // userPersonalDetail.workEmailAddress = parseXMLtoJSON.workEmailAddress;
                // userPersonalDetail.gender = parseXMLtoJSON.gender==1?"Male":"Female";
                // userPersonalDetail.maritalStatus = parseXMLtoJSON.maritalStatus==1?"Married":"Single";
                // userPersonalDetail.residentialAddress1 = parseXMLtoJSON.address1;
                // userPersonalDetail.residentialAddress2 = parseXMLtoJSON.address2;
                // userPersonalDetail.city = parseXMLtoJSON.city;
                // userPersonalDetail.postcode = parseXMLtoJSON.postcode;
                // userPersonalDetail.state = parseXMLtoJSON.state;
                // userPersonalDetail.country = parseXMLtoJSON.country;
                // userPersonalDetail.religion = parseXMLtoJSON.religion;
                // userPersonalDetail.nationality = parseXMLtoJSON.nationality;
                // userPersonalDetail.phoneNumber = parseXMLtoJSON.phoneNumber;
                // userPersonalDetail.workPhoneNumber = parseXMLtoJSON.workPhoneNumber;
                // userPersonalDetail.race = parseXMLtoJSON.race;
                // userPersonalDetail.family = parseXMLtoJSON.family;
                // userPersonalDetail.education = parseXMLtoJSON.education;
                // userPersonalDetail.emergencyContactNumber = parseXMLtoJSON.emergencyContact;

                userProfileData.personalDetail = userPersonalDetail;
            }

            if (isShowCertData) {

                //userProfileData.awardCertification = parseXMLtoJSON.
                userProfileData.awardCertification = [];
            }
        }

        if (isShowEmploymentData) {
            const employmentDetail = new EmploymentDetailDTO();

            //process the employment data
            employmentDetail.department = data.DEPARTMENT;
            employmentDetail.designation = data.DESIGNATION;;
            employmentDetail.workLocation = "Kuala Lumpur, Malaysia"
            employmentDetail.employeeNumber = data.PERSONAL_ID;
            employmentDetail.employmentStatus = data.EMPLOYEE_STATUS.toString();
            employmentDetail.employmentType = data.EMPLOYEE_TYPE.toString();
            employmentDetail.reportingTo = data.MANAGER_USER_GUID;
            employmentDetail.userRole = "Employee";
            employmentDetail.dateOfJoin = data.JOIN_DATE;
            employmentDetail.dateOfConfirmation = data.CONFIRMATION_DATE;
            employmentDetail.dateOfResign = data.RESIGNATION_DATE;
            employmentDetail.yearOfService = this.serviceYearCalcService.calculateEmployeeServiceYear(new Date(data.JOIN_DATE)) + " Years";
            employmentDetail.epfNumber = data.PR_EPF_NUMBER;
            employmentDetail.incomeTaxNumber = data.PR_INCOMETAX_NUMBER;
            employmentDetail.bankAccountName = data.BANK;
            employmentDetail.bankAccountNumber = data.PR_ACCOUNT_NUMBER;

            userProfileData.employmentDetail = employmentDetail;
        }

        if (isShowEntitlementData) {

            // const entitlementData2 = this.entitlementDetailService.getEntitlementList(data.TENANT_GUID,data.USER_GUID);

            // console.log('helloooooooothere');
            // const entitlementModel = new UserLeaveEntitlementModel();
            // const entitlementData = new EntitlementDetailDTO();

            // entitlementData.balanceDays = 1;
            // entitlementData.entitledDays = 11;
            // entitlementData.leaveTypeId = 'DEWDH';
            // entitlementData.leaveTypeName = 'RJE';
            // entitlementData.pendingDays = 90;
            // entitlementData.takenDays = 8;

            // userProfileData.entitlementDetail.push(entitlementData);
            // userProfileData.entitlementDetail = entitlementData;
            userProfileData.entitlementDetail = [];

            // userProfileData.entitlementDetail = leaveEntitlementMock;
        }

        return userProfileData;

    }


    private joinText(data: string[]) {
        return data.join(",");
    }

}
