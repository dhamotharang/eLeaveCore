import { Controller, UseGuards, HttpService, Get, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiImplicitQuery } from '@nestjs/swagger';
import { DreamFactory } from 'src/config/dreamfactory';
import { CommonFunctionService } from 'src/common/helper/common-function.services';
import { DashboardService } from './dashboard.service';
import { XMLParserService } from 'src/common/helper/xml-parser.service';
import moment = require('moment');

/**
 * All dashboard api
 *
 * @export
 * @class DashboardController
 */
@Controller('/api')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class DashboardController {
    constructor(
        private http: HttpService,
        private commonFunctionService: CommonFunctionService,
        private dashboardService: DashboardService,
        private xmlParserService: XMLParserService
    ) { }

    /**
     * Get total employee and onleave count
     *
     * @param {*} req
     * @param {*} res
     * @memberof DashboardController
     */
    @Get('/employee/status-onleave')
    @ApiOperation({ title: 'Get total employee status onleave' })
    // @ApiImplicitQuery({ name: 'tenantguid', description: 'Tenant guid', required: true })
    @ApiImplicitQuery({ name: 'startdate', description: 'Start date leave', required: true })
    @ApiImplicitQuery({ name: 'enddate', description: 'End date leave', required: true })
    findTotalEmployee(@Req() req, @Res() res) {
        this.runService(req, res, 'dashboard_onleave');
    }

    /**
     * Get employee onleave (name and designation)
     *
     * @param {*} req
     * @param {*} res
     * @memberof DashboardController
     */
    @Get('/employee/leave-list')
    @ApiOperation({ title: 'Get total employee on leave' })
    // @ApiImplicitQuery({ name: 'tenantguid', description: 'Tenant guid', required: true })
    @ApiImplicitQuery({ name: 'startdate', description: 'Start date leave', required: true })
    @ApiImplicitQuery({ name: 'enddate', description: 'End date leave', required: true })
    findEmployeeLeaveList(@Req() req, @Res() res) {
        this.runService(req, res, 'employee_leave_list');
    }

    /**
     * Calendar leave list
     *
     * @param {*} req
     * @param {*} res
     * @memberof DashboardController
     */
    @Get('/employee/calendar-leave-list')
    @ApiOperation({ title: 'Get all list of employee to calendar' })
    // @ApiImplicitQuery({ name: 'tenantguid', description: 'Tenant guid', required: true })
    @ApiImplicitQuery({ name: 'startdate', description: 'Start date leave', required: true })
    @ApiImplicitQuery({ name: 'enddate', description: 'End date leave', required: true })
    findCalendarLeaveList(@Req() req, @Res() res) {
        this.runService(req, res, 'calendar_leave');
    }

    /**
     * Get upcoming holiday
     *
     * @param {*} req
     * @param {*} res
     * @memberof DashboardController
     */
    @Get('/employee/upcoming-holiday')
    @ApiOperation({ title: 'Get all list of upcoming holiday' })
    getUpcomingHoliday(@Req() req, @Res() res) {
        this.dashboardService.upcomingHolidays(req.user.USER_GUID).subscribe(
            data => {
                let upcomingHolidayArr = [];
                let holidayData = this.xmlParserService.convertXMLToJson(data.data.resource[0].PROPERTIES_XML);

                holidayData.holiday.forEach(element => {
                    if (moment(element.start, 'YYYY-MM-DD') > moment()) {
                        upcomingHolidayArr.push(element);
                    }
                });
                res.send(upcomingHolidayArr);
            }, err => {
                res.send(err);
            }
        );
    }

    /**
     * Function refactor run service 
     *
     * @param {*} req
     * @param {*} res
     * @param {*} method_procedure
     * @memberof DashboardController
     */
    public runService(req, res, method_procedure) {
        let url = DreamFactory.df_host_proc + `${method_procedure}(${req.user.TENANT_GUID},${req.query.startdate},${req.query.enddate})`;
        this.http.get(url).subscribe(data => {
            this.commonFunctionService.sendResSuccessV2(data, res);
        }, err => {
            this.commonFunctionService.sendResErrorV3(err, res);
        });
    }

}