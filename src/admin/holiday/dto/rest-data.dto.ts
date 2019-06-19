import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsJSON } from "class-validator";
import { isObject } from "util";

/**
 *
 *
 * @export
 * @class RestDataDTO
 */
export class RestDataDTO {
    @ApiModelProperty()
    @IsNotEmpty()
    readonly name: string;

    @ApiModelProperty()
    @IsNotEmpty()
    readonly fullname: string; 
}