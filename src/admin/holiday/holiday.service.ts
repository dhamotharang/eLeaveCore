import { Injectable, HttpStatus } from '@nestjs/common';
import { HolidayDbService } from './db/holiday.db.service';
import { map, mergeMap, concatMap } from 'rxjs/operators';
import { Resource } from 'src/common/model/resource.model';
import { HolidayModel } from './model/holiday.model';
import { XMLParserService } from 'src/common/helper/xml-parser.service';
import { v1 } from 'uuid';
import { CreateHolidayModel } from './model/create-holiday.model';
import { CreateCalendarDTO } from './dto/create-calendar.dto';
import { CalendarDTO } from './dto/calendar.dto';
import { AssignerDataService } from 'src/common/helper/assigner-data.service';
import { UpdateUserCalendarModel } from './model/update-usercalendar.model';
import { UpdateCalendarDTO } from './dto/update-calendar.dto';
import { UserInfoDbService } from './db/user-info.db.service';
import { UpdateUserCalendarDTO } from './dto/update-usercalendar.dto';

/**
 *
 *
 * @export
 * @class HolidayService
 */
@Injectable()
export class HolidayService {
    constructor(private readonly holidayDbService: HolidayDbService,
        private readonly userinfoDbService: UserInfoDbService,
        private readonly xmlParserService: XMLParserService,
        private readonly assignerDataService: AssignerDataService) { }

    /**
     * list holiday for selected calendar by calendar guid
     *
     * @param {string} calendarId
     * @returns
     * @memberof HolidayService
     */
    public getHolidayList(calendarId: string) {
        return this.holidayDbService.findAll(calendarId)
            .pipe(map(res => {
                if (res.status == 200) {
                    let jsonHoliday = this.xmlParserService.convertXMLToJson(res.data.resource[0].PROPERTIES_XML);
                    return jsonHoliday;
                }
            }))
    }

    /**
     * list all calendar that has been created
     *
     * @returns
     * @memberof HolidayService
     */
    public getCalendarProfileList() {
        return this.holidayDbService.findAllProfile()
            .pipe(map(res => {
                if (res.status == 200) {
                    let result = this.assignerDataService.assignArrayData(res.data.resource, CalendarDTO);
                    return result;
                }
            })
            )
    }

    /**
     * assign calendar to employee user info table
     *
     * @param {*} user
     * @param {*} d
     * @returns
     * @memberof HolidayService
     */
    updateToEmployee(user: any, d: UpdateUserCalendarDTO) {
        const resource = new Resource(new Array);
        const data = new UpdateUserCalendarModel

        data.CALENDAR_GUID = d.calendar_guid;
        data.UPDATE_TS = new Date().toISOString();
        data.UPDATE_USER_GUID = user.USER_GUID;

        resource.resource.push(data);

        return this.userinfoDbService.updateByModel(resource, [], ['(USER_GUID=' + d.user_guid + ')'], []);
    }

    /**
     * update existing calendar
     *
     * @param {*} user
     * @param {UpdateCalendarDTO} d
     * @returns
     * @memberof HolidayService
     */
    updateCalendar(user: any, d: UpdateCalendarDTO) {
        const resource = new Resource(new Array);
        const data = new HolidayModel();

        data.PROPERTIES_XML = this.xmlParserService.convertJsonToXML(d.data);
        data.CODE = d.data.code;
        data.UPDATE_TS = new Date().toISOString();
        data.UPDATE_USER_GUID = user.USER_GUID;

        resource.resource.push(data);

        return this.holidayDbService.updateByModel(resource, [], ['(CALENDAR_GUID=' + d.calendar_guid + ')'], ['CALENDAR_GUID', 'CODE', 'PROPERTIES_XML']);
    }

    /**
     * setup new calendar profile using data from calendarific
     *
     * @param {*} user
     * @param {CreateCalendarDTO} data
     * @returns
     * @memberof HolidayService
     */
    create(user: any, data: CreateCalendarDTO) {
        const resource = new Resource(new Array);
        const modelData = new CreateHolidayModel();

        modelData.CODE = data.code;
        modelData.CALENDAR_GUID = v1();
        modelData.CREATION_TS = new Date().toISOString();
        modelData.CREATION_USER_GUID = user.USER_GUID;
        modelData.PROPERTIES_XML = this.xmlParserService.convertJsonToXML(data);
        modelData.UPDATE_TS = null;
        modelData.UPDATE_USER_GUID = null;

        resource.resource.push(modelData);

        return this.holidayDbService.createByModel(resource, [], [], []);
    }
}