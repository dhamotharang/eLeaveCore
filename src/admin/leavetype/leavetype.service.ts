import { Injectable, HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Resource } from 'src/common/model/resource.model';
import { v1 } from 'uuid';
import { LeaveTypeModel } from './model/leavetype.model';
import { QueryParserService } from 'src/common/helper/query-parser.service';
import { BaseDBService } from 'src/common/base/base-db.service';
import { IDbService } from 'src/interface/IDbService';
import { CreateLeaveTypeDto } from './dto/create-leavetype.dto';
import { UpdateLeaveTypeDto } from './dto/update-leavetype.dto';

/**
 * Service for leavetype
 *
 * @export
 * @class LeavetypeService
 * @extends {BaseDBService}
 * @implements {IDbService}
 */
@Injectable()
export class LeavetypeService extends BaseDBService implements IDbService {

    /**
     * Declare tablename l_main_leavetype
     *
     * @private
     * @memberof LeavetypeService
     */
    private table_name = "l_main_leavetype";

    /**
     *Creates an instance of LeavetypeService.
     * @param {HttpService} httpService Service for http
     * @param {QueryParserService} queryService Service for query
     * @memberof LeavetypeService
     */
    constructor(
        public readonly httpService: HttpService,
        public readonly queryService: QueryParserService) {
        super(httpService, queryService, "l_main_leavetype");
    }


    /**
     * Find all tenant leavetype
     *
     * @param {string} tenantid
     * @returns {Observable<any>}
     * @memberof LeavetypeService
     */
    public findAll(tenantid: string): Observable<any> {

        const fields = ['LEAVE_TYPE_GUID', 'CODE', 'DESCRIPTION'];
        const filters = ['(TENANT_GUID=' + tenantid + ')', '(DELETED_AT IS NULL)'];
        //url
        const url = this.queryService.generateDbQuery(this.table_name, fields, filters);

        //call DF to validate the user
        return this.httpService.get(url);

    }


    /**
     * Find tenant leavetype by id
     *
     * @param {string} tenantid
     * @param {string} id
     * @returns {Observable<any>}
     * @memberof LeavetypeService
     */
    public findById(tenantid: string, id: string): Observable<any> {

        const fields = ['LEAVE_TYPE_GUID', 'CODE', 'DESCRIPTION'];
        const filters = ['(TENANT_GUID=' + tenantid + ')', '(LEAVE_TYPE_GUID=' + id + ')'];
        //url
        const url = this.queryService.generateDbQuery(this.table_name, fields, filters);


        //call DF to validate the user
        return this.httpService.get(url);
    }

    /**
     * Create new leavetype
     *
     * @param {*} user
     * @param {*} data
     * @returns
     * @memberof LeavetypeService
     */
    create(user: any, data: CreateLeaveTypeDto) {

        const resource = new Resource(new Array);
        const modelData = new LeaveTypeModel()

        modelData.LEAVE_TYPE_GUID = v1();
        modelData.CREATION_TS = new Date().toISOString();
        modelData.CREATION_USER_GUID = user.USER_GUID;
        modelData.ACTIVE_FLAG = 1;
        modelData.CODE = data.code;
        modelData.DESCRIPTION = data.description;
        modelData.TENANT_GUID = user.TENANT_GUID;
        // modelData.TENANT_COMPANY_GUID = data.companyId;

        resource.resource.push(modelData);

        return this.createByModel(resource, [], [], []);
    }

    /**
     * Update existing leavetype
     *
     * @param {*} user
     * @param {*} d
     * @returns
     * @memberof LeavetypeService
     */
    update(user: any, d: UpdateLeaveTypeDto) {

        // do a checking first to determine this data belong to user

        const resource = new Resource(new Array);
        const data = new LeaveTypeModel()

        data.LEAVE_TYPE_GUID = d.id;
        data.UPDATE_TS = new Date().toISOString();
        data.UPDATE_USER_GUID = user.USER_GUID;
        data.CODE = d.code;
        data.DESCRIPTION = d.description;
        data.TENANT_GUID = user.TENANT_GUID;
        // data.TENANT_COMPANY_GUID = d.companyId;

        resource.resource.push(data);

        return this.updateByModel(resource, [], [], []);

    }

    /**
     * Delete method
     *
     * @param {*} user
     * @param {string} leavetype_guid
     * @returns
     * @memberof LeavetypeService
     */
    delete(user: any, leavetype_guid: string) {

        // do a checking first to determine this data belong to user

        const resource = new Resource(new Array);
        const data = new LeaveTypeModel()

        data.DELETED_AT = new Date().toISOString();
        data.UPDATE_TS = new Date().toISOString();
        data.UPDATE_USER_GUID = user.USER_GUID;

        resource.resource.push(data);

        return this.updateByModel(resource, [], ['(LEAVE_TYPE_GUID=' + leavetype_guid + ')'], ['LEAVE_TYPE_GUID', 'CODE']);

    }
}

