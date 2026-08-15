import { Controller, Get } from "@nestjs/common";
import { CountriesService } from "./countries.service";
import type { CountryResponseDto } from "./dto/country-response.dto";

@Controller("countries")
export class CountriesController {
    constructor(private readonly countriesService: CountriesService) {}

    @Get()
    findAll(): Promise<CountryResponseDto[]> {
        return this.countriesService.findAllActive();
    }
}
