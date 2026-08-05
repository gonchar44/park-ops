import { Controller, Get, Query } from "@nestjs/common";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { CitiesService } from "./cities.service";
import type { CityResponseDto } from "./dto/city-response.dto";
import { listCitiesQuerySchema, type ListCitiesQueryDto } from "./dto/list-cities-query.dto";

@Controller("cities")
export class CitiesController {
    constructor(private readonly citiesService: CitiesService) {}

    @Get()
    findAll(
        @Query(new ZodValidationPipe(listCitiesQuerySchema)) query: ListCitiesQueryDto,
    ): Promise<CityResponseDto[]> {
        return this.citiesService.findFiltered(query);
    }
}
