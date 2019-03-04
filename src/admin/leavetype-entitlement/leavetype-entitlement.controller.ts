import { Controller, Get, Req, Res, Post, Body, UseGuards, Param, Patch } from '@nestjs/common';
import { LeavetypeEntitlementService } from './leavetype-entitlement.service';
import { CreateLeaveEntitlementTypeDto } from './dto/create-leavetype_entitlement.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateLeaveTypeEntitlementDto } from './dto/update-leavetype_entitlement.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('api/admin/leavetype-entitlement')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class LeavetypeEntitlementController {

    constructor(private readonly leavetypeEntitlementService: LeavetypeEntitlementService){}
    
    @Get(':id')
    findOne(@Param('id') id, @Req() req,@Res() res) {
        this.leavetypeEntitlementService.findById(req.user.TENANT_GUID, id).subscribe(
            data => {
                if(data.status==200)
                {
                    res.send(data.data.resource[0]);
                }
                else {
                    res.status(data.status);
                    res.send();
                }
            },
            err => {
                res.status(400);
                res.send('Fail to fetch resource');
            }
        );
    }


    @Get()
    findAll(@Req() req,@Res() res) {
        this.leavetypeEntitlementService.findAll(req.user.TENANT_GUID).subscribe(
            data => {
                if(data.status==200)
                    res.send(data.data.resource);
                else {
                    res.status(data.status);
                    res.send();
                }
            },
            err => {
                res.status(400);
                res.send('Fail to fetch resource');
            }
        )
    }

    @Post()
    create(@Body() createLeaveEntitlementDTO: CreateLeaveEntitlementTypeDto,@Req() req, @Res() res) {
        this.leavetypeEntitlementService.create(req.user,createLeaveEntitlementDTO)
            .subscribe(
                data => {
                    if(data.status==200)
                        res.send(data.data.resource[0]);
                    else {
                        res.status(data.status);
                        res.send();
                    }
                },
                err => {
                    res.status(400);
                    res.send('Fail to update resource');
                }
            )
    }

    @Patch()
    update(@Body() updateLeaveTypeEntitlementDTO: UpdateLeaveTypeEntitlementDto,@Req() req, @Res() res) {
        this.leavetypeEntitlementService.update(req.user,updateLeaveTypeEntitlementDTO)
        .subscribe(
            data => {
                if(data.status==200)
                    res.send(data.data.resource[0]);
                else {
                    res.status(data.status);
                    res.send();
                }
            },
            err => {
                res.status(400);
                res.send('Fail to update resource');    
                
            }
        )
    }


}