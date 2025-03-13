import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString, Min } from "class-validator";

export class GetProductsDto {

    @IsNumber()
    public id: number

    @IsString()
    public name: string

    @IsNumber()
    public stock: number

    @IsBoolean()
    public available: boolean

    @IsNumber({
        maxDecimalPlaces: 4,
    })
    @Min(0)
    @Type( () => Number )
    public price: number

}