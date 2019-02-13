import { Controller, Post, Body, Req, Res, Patch, Get, Param, UseGuards } from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateCostCentreDto } from '../costcentre/dto/create-costcentre.dto';
import { UpdateCostCentreDto } from '../costcentre/dto/update-costcentre.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/admin/section')
@UseGuards(AuthGuard('jwt'))
export class SectionController {

    constructor(private readonly sectionService: SectionService) {}

  @Post()
  create(@Body() createBranchDTO: CreateCostCentreDto,@Req() req, @Res() res) {

    this.sectionService.create(req.user,createBranchDTO.name)
      .subscribe(
        data => {
          if(data.status==200)
            res.send(data.data);
        },
        err => {
          res.status(400);
          res.send('Fail to create resource');
          //console.log(err.response.data.error.context);
        }
    )
  }

  @Patch()
  update(@Body() updateBranchDTO: UpdateCostCentreDto,@Req() req, @Res() res) {
    this.sectionService.update(req.user,updateBranchDTO)
      .subscribe(
        data => {
          if(data.status==200)
            res.send(data.data);
        },
        err => {
          res.status(400);
          res.send('Fail to update resource');    
        }
    )
  }

  @Get()
  findAll(@Req() req,@Res() res) {
    this.sectionService.findAll(req.user.USER_GUID,req.user.TENANT_GUID).subscribe(
      data => {
        res.send(data.data.resource);
      },
      err => {
        //console.log(err.response.data);
        res.status(400);
        res.send('Fail to fetch resource');  
      }
    );

  }

  @Get(':id')
  findOne(@Param('id') id, @Req() req,@Res() res) {
    this.sectionService.findById(req.user.USER_GUID,req.user.TENANT_GUID, id).subscribe(
      data => {
        res.send(data.data.resource[0]);
      },
      err => {
        res.status(400);
          res.send('Fail to fetch resource');  
      }
    );
  }

}