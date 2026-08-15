import { Controller, Get, Query } from "@nestjs/common";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { MunicipalitiesService } from "./municipalities.service";
import type { MunicipalityResponseDto } from "./dto/municipality-response.dto";
import { listMunicipalitiesQuerySchema, type ListMunicipalitiesQueryDto } from "./dto/list-municipalities-query.dto";

@Controller("municipalities")
export class MunicipalitiesController {
    constructor(private readonly municipalitiesService: MunicipalitiesService) {}

    @Get()
    findAll(
        @Query(new ZodValidationPipe(listMunicipalitiesQuerySchema)) query: ListMunicipalitiesQueryDto,
    ): Promise<MunicipalityResponseDto[]> {
        return this.municipalitiesService.findFiltered(query);
    }
}
