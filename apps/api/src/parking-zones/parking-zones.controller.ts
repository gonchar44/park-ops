import { Controller, Get, Query } from "@nestjs/common";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { ParkingZonesService } from "./parking-zones.service";
import type { ParkingZoneResponseDto } from "./dto/parking-zone-response.dto";
import { listParkingZonesQuerySchema, type ListParkingZonesQueryDto } from "./dto/list-parking-zones-query.dto";

@Controller("parking-zones")
export class ParkingZonesController {
    constructor(private readonly parkingZonesService: ParkingZonesService) {}

    @Get()
    findAll(
        @Query(new ZodValidationPipe(listParkingZonesQuerySchema)) query: ListParkingZonesQueryDto,
    ): Promise<ParkingZoneResponseDto[]> {
        return this.parkingZonesService.findFiltered(query);
    }
}
