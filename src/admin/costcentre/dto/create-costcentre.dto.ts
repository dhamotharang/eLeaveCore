
import { IsNotEmpty } from 'class-validator';
export class CreateCostCentreDto {
    @IsNotEmpty()
    readonly name: string;
} 