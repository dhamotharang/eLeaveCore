export class YearEntitlementBaseService {
    public getEntitlementFromPolicy(leavePolicy: any, yearOfService: number) {

        // Check if leave entitlement is an array or not
        const checkArray = leavePolicy.levels.leaveEntitlement instanceof Array;

        let entitledDay;

        if(checkArray) {
            //find the entitle day for this service year
            entitledDay = leavePolicy.levels.leaveEntitlement.find(x=>yearOfService>=x.service_year_from&&yearOfService<=x.service_year_to);
        } else {
            if(yearOfService>=leavePolicy.levels.leaveEntitlement.service_year_from&&yearOfService<=leavePolicy.levels.leaveEntitlement.service_year_to) {
                entitledDay = leavePolicy.levels.leaveEntitlement;
            }
        }

        return entitledDay;
    }
}