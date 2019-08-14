import { Controller, UseGuards, Post, Body, Req, Res, Patch, Get, Param, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LeavetypeService } from './leavetype.service';
import { CreateLeaveTypeDto } from './dto/create-leavetype.dto';
import { UpdateLeaveTypeDto } from './dto/update-leavetype.dto';
import { ApiBearerAuth, ApiOperation, ApiImplicitQuery } from '@nestjs/swagger';
import { CommonFunctionService } from 'src/common/helper/common-function.services';

/**
 * Leavetype controller
 *
 * @export
 * @class LeaveTypeController
 */
@Controller('/api/admin/leavetype')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class LeaveTypeController {

  constructor(private readonly leavetypeService: LeavetypeService,
    private readonly commonFunctionService: CommonFunctionService) { }

  /**
   * Get all leavetype
   *
   * @param {*} req
   * @param {*} res
   * @memberof LeaveTypeController
   */
  @Get()
  @ApiOperation({ title: 'Find all Leavetype' })
  findAllLeavetype(@Req() req, @Res() res) {
    this.leavetypeService.findAll(req.user.TENANT_GUID).subscribe(
      data => {
        res.send(data.data.resource);
      },
      err => {
        this.commonFunctionService.sendResErrorV2(res, 400, 'Fail to fetch resource');
      }
    );

  }

  /**
   * Find one leavetype by id
   *
   * @param {*} id
   * @param {*} req
   * @param {*} res
   * @memberof LeaveTypeController
   */
  @Get(':id')
  @ApiOperation({ title: 'Find one Leavetype' })
  @ApiImplicitQuery({ name: 'id', description: 'Filter by leavetype guid', required: true })
  findOne(@Param('id') id, @Req() req, @Res() res) {

    id = this.commonFunctionService.findIdParam(req, res, id);
    this.leavetypeService.findById(req.user.TENANT_GUID, id).subscribe(
      data => {
        res.send(data.data.resource[0]);
      },
      err => {
        this.commonFunctionService.sendResErrorV2(res, 400, 'Fail to fetch resource');
      }
    );
  }

  /**
   * Create new leavetype
   *
   * @param {CreateLeaveTypeDto} createLeavetypeDTO
   * @param {*} req
   * @param {*} res
   * @memberof LeaveTypeController
   */
  @Post()
  @ApiOperation({ title: 'Create leavetype' })
  create(@Body() createLeavetypeDTO: CreateLeaveTypeDto, @Req() req, @Res() res) {

    this.leavetypeService.create(req.user, createLeavetypeDTO)
      .subscribe(
        data => { if (data.status == 200) { res.send(data.data); } },
        err => { this.commonFunctionService.sendResErrorV2(res, 400, 'Fail to create resource'); }
      )
  }

  /**
   * Update existing leavetype
   *
   * @param {UpdateLeaveTypeDto} updateLeaveTypeDTO
   * @param {*} req
   * @param {*} res
   * @memberof LeaveTypeController
   */
  @Patch()
  @ApiOperation({ title: 'Update Leavetype' })
  updateLeavetype(@Body() updateLeaveTypeDTO: UpdateLeaveTypeDto, @Req() req, @Res() res) {
    this.leavetypeService.update(req.user, updateLeaveTypeDTO)
      .subscribe(
        data => { if (data.status == 200) { res.send(data.data); } },
        err => { this.commonFunctionService.sendResErrorV2(res, 400, 'Fail to update resource'); }
      )
  }

  /**
   * Delete leavetype
   *
   * @param {*} id
   * @param {*} req
   * @param {*} res
   * @memberof LeaveTypeController
   */
  @Delete('/:id')
  @ApiOperation({ title: 'Delete leavetype' })
  @ApiImplicitQuery({ name: 'id', description: 'Delete by leavetype guid', required: true })
  deleteLeavetype(@Param('id') id, @Req() req, @Res() res) {
    id = this.commonFunctionService.findIdParam(req, res, id);
    this.commonFunctionService.runUpdateService(this.leavetypeService.delete(req.user, id), res);
  }

}

