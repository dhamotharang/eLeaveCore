import { Injectable, HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DreamFactory } from 'src/config/dreamfactory';
import { Resource } from 'src/common/model/resource.model';
import { v1 } from 'uuid';
import { LeaveTypeModel } from './model/leavetype.model';
import { QueryParserService } from 'src/common/helper/query-parser.service';
import { BaseDBService } from 'src/common/base/base-db.service';

@Injectable()
export class LeavetypeService extends BaseDBService {
    private table_name = "l_main_leavetype";

    constructor(
        public readonly httpService: HttpService,
        public readonly queryService: QueryParserService){
            super(httpService,queryService,"l_main_leavetype");
        }

    //find all tenant leavetype
    public findAll(tenantid:string): Observable<any> {

        const fields = ['LEAVE_TYPE_GUID','CODE','DESCRIPTION'];
        const filters = ['(TENANT_GUID='+tenantid+')'];
        //url
        const url = this.queryService.generateDbQuery(this.table_name,fields,filters);
 
        //call DF to validate the user
        return this.httpService.get(url);
        
    }

    //find tenant leavetype by id
    public findById(tenantid:string, id: string): Observable<any> {
        
        const fields = ['LEAVE_TYPE_GUID','CODE','DESCRIPTION'];
        const filters = ['(TENANT_GUID='+tenantid+')','(LEAVE_TYPE_GUID='+id+')'];
        //url
        const url = this.queryService.generateDbQuery(this.table_name,fields,filters);
 

        //call DF to validate the user
        return this.httpService.get(url);
    }

    //create new branch
    create(user: any, code: string, description: string) {

        const resource = new Resource(new Array);
        const data = new LeaveTypeModel()

        data.LEAVE_TYPE_GUID = v1();
        data.CREATION_TS = new Date().toISOString();
        data.CREATION_USER_GUID = user.USER_GUID;
        data.ACTIVE_FLAG = 1;
        data.CODE = code;
        data.DESCRIPTION = description;
        data.TENANT_GUID = user.TENANT_GUID;

        resource.resource.push(data);

        return this.createByModel(resource,[],[],[]);
    }

    //update existing branch
    update(user:any, d: any) {

        // do a checking first to determine this data belong to user
        
        const resource = new Resource(new Array);
        const data = new LeaveTypeModel()

        data.LEAVE_TYPE_GUID = d.id;
        data.UPDATE_TS = new Date().toISOString();
        data.UPDATE_USER_GUID = user.USER_GUID;
        data.CODE = d.code;
        data.DESCRIPTION = d.description;
        data.TENANT_GUID = user.TENANT_GUID;

        resource.resource.push(data);

        return this.updateByModel(resource,[],[],[]);

    }
}

