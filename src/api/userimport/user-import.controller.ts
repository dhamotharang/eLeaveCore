import { Controller, UseGuards, Post, UseInterceptors, UploadedFile, Req, Res, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiImplicitFile } from '@nestjs/swagger';
import parse = require('csv-parse/lib/sync');
import { UserImportService } from './user-import.service';
import { UserCsvDto } from './dto/csv/user-csv.dto';
import { FileInterceptor } from '@nestjs/platform-express';

/**
 * Controller for user import
 *
 * @export
 * @class UserImportController
 */
@Controller('api/userimport')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UserImportController {

	/**
	 *Creates an instance of UserImportController.
	 * @param {UserImportService} userImportService
	 * @memberof UserImportController
	 */
	constructor(private readonly userImportService: UserImportService) { }

	/**
	 *create user import
	 *
	 * @param {[UserCsvDto]} userInviteDto
	 * @param {*} req
	 * @param {*} res
	 * @memberof UserImportController
	 */
	@Post()
	@ApiOperation({ title: 'Import user' })
	create(@Body() userInviteDto: [UserCsvDto], @Req() req, @Res() res) {
		this.runService([req.user, userInviteDto, res]);
	}

	/**
	 * import csv user import
	 *
	 * @param {*} file
	 * @param {*} req
	 * @param {*} res
	 * @memberof UserImportController
	 */
	@Post('csv')
	@ApiImplicitFile({ name: 'file', required: true, description: 'The file to upload' })
	@UseInterceptors(FileInterceptor('file'))
	@ApiOperation({ title: 'Import user from CSV list' })
	importCSV(@UploadedFile() file, @Req() req, @Res() res) {
		if (!req.file) {
			res.status(400).send("File is null");
		}

		const records = parse(file.buffer, {
			columns: true,
			skip_empty_lines: true
		})

		this.runService([req.user, records, res]);
	}

	/**
	 * run service userimport
	 *
	 * @private
	 * @param {*} [user, data, res]
	 * @memberof UserImportController
	 */
	private runService([user, data, res]) {
		this.userImportService.processImportData(user, data).subscribe(
			data => { res.send(data); },
			err => { res.status(400).send("fail to process data"); }
		)
	}

}
