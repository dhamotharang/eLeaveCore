export class UserInfoModel {
    USER_INFO_GUID: string; //PK
    USER_GUID: string; //FK
    //TENANT_GUID: string;
    
    // Personal Information
    FULLNAME: string;
    NICKNAME: string;
    SALUTATION: string;
    PERSONAL_ID: string;
    PERSONAL_ID_TYPE: string;
    GENDER: number;
    MARITAL_STATUS: number;
    DOB: Date;

    // Employee Company Information
    TENANT_COMPANY_GUID: string;
    TENANT_COMPANY_SITE_GUID: string;
    MANAGER_USER_GUID: string; //reporting to whom
    BRANCH: string; //employee belong to which branch
    DEPT_GUID: string; //employee belong to which department
    DESIGNATION_GUID: string //employee job title
    JOIN_DATE: Date;
    CONFIRMATION_DATE: Date;
    RESIGNATION_DATE: Date;
    EMPLOYEE_STATUS: number;
    EMPLOYEE_TYPE: number;

    XML: string;

    //ACTIVE_FLAG: number;
    CREATION_TS: Date;
    CREATION_USER_GUID: string;
    UPDATE_TS: string;
    UPDATE_USER_GUID: string;
}