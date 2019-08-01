import { GeneralLeavePolicyModel } from './model/general-leave-policy.model';
import { CreateGeneralLeavePolicyDTO } from './dto/create-general-leave-policy.dto';
import { Resource } from 'src/common/model/resource.model';
import { v1 } from 'uuid';
import { XMLParserService } from '../../common/helper/xml-parser.service';
import { HttpService, Injectable } from '@nestjs/common';
import { QueryParserService } from 'src/common/helper/query-parser.service';
import { CommonFunctionService } from 'src/common/helper/common-function.services';
import { BaseDBService } from 'src/common/base/base-db.service';
import { Observable } from 'rxjs';
import { UpdateGeneralLeavePolicyDTO } from './dto/update-general-leave-policy.dto';
/**
 * Service for general leave policy
 *
 * @export
 * @class GeneralLeavePolicyService
 * @extends {BaseDBService}
 */
@Injectable()
export class GeneralLeavePolicyService extends BaseDBService {

	/**
	 * Declare table name for general leave policy
	 *
	 * @private
	 * @memberof GeneralLeavePolicyService
	 */
	private _tableName = "l_main_general_policy";

	/**
	 *Creates an instance of GeneralLeavePolicyService.
	 * @param {CommonFunctionService} commonFunctionService Commonfunction service
	 * @param {XMLParserService} xmlParserService XML parser service
	 * @param {HttpService} httpService http service
	 * @param {QueryParserService} queryService query service
	 * @memberof GeneralLeavePolicyService
	 */
	constructor(
		private readonly commonFunctionService: CommonFunctionService,
		private readonly xmlParserService: XMLParserService,
		public readonly httpService: HttpService,
		public readonly queryService: QueryParserService) {
		super(httpService, queryService, "l_main_general_policy");
	}

	/**
	 * Get general leave policy
	 *
	 * @param {string} TENANT_GUID
	 * @returns {Observable<any>}
	 * @memberof GeneralLeavePolicyService
	 */
	public findAll(TENANT_GUID: string): Observable<any> {

		const fields = [];
		let result = this.commonFunctionService.findAllList(fields, TENANT_GUID, this.queryService, this.httpService, this._tableName);

		return this.commonFunctionService.getListData(result);
	}

	/**
	 * Create general leave policy
	 *
	 * @param {*} user
	 * @param {CreateGeneralLeavePolicyDTO} d
	 * @returns
	 * @memberof GeneralLeavePolicyService
	 */
	create(user: any, d: CreateGeneralLeavePolicyDTO) {
		// console.log(JSON.stringify(d));
		// console.log(d);
		const resource = new Resource(new Array);
		const modelData = new GeneralLeavePolicyModel();

		modelData.MAIN_GENERAL_POLICY_GUID = v1();
		modelData.TENANT_GUID = user.TENANT_GUID;
		modelData.TENANT_COMPANY_GUID = d.tenantCompanyId;
		modelData.PROPERTIES_XML = this.xmlParserService.convertJsonToXML(d);
		modelData.CREATION_TS = new Date().toISOString();
		modelData.CREATION_USER_GUID = user.USER_GUID;
		modelData.UPDATE_TS = null;
		modelData.UPDATE_USER_GUID = null;
		modelData.DELETED_AT = null;
		modelData.CODE = d.policyName;

		resource.resource.push(modelData);
		// console.log(resource);

		return this.createByModel(resource, [], [], []);

	}

	/**
	 * Update general leave policy
	 *
	 * @param {*} user
	 * @param {UpdateGeneralLeavePolicyDTO} d
	 * @returns
	 * @memberof GeneralLeavePolicyService
	 */
	update(user: any, d: UpdateGeneralLeavePolicyDTO) {
		// console.log(d);
		const resource = new Resource(new Array);
		const data = new GeneralLeavePolicyModel();


		data.MAIN_GENERAL_POLICY_GUID = d.generalPolicyId;
		data.PROPERTIES_XML = this.xmlParserService.convertJsonToXML(d.data);
		data.UPDATE_TS = new Date().toISOString();
		data.UPDATE_USER_GUID = user.USER_GUID;

		resource.resource.push(data);
		// console.log(resource);

		return this.updateByModel(resource, [], [], []);
	}

}