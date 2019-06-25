import { LeaveTypeServiceYear } from './leavetype_serviceyear';

/**
 * Model for leave type properties
 *
 * @export
 * @class LeaveTypePropertiesModel
 */
export class LeaveTypePropertiesModel {
    apply_in_advance = false;
    apply_next_year = false;
    claim_entitlement = false;
    apply_halfday = false;
    attachment_required = false;
    apply_before: any;
    apply_more_than_balance: any;
    allow_cancel_after_startdate: any;
    levels = new Array<LeaveTypeServiceYear>()

} 