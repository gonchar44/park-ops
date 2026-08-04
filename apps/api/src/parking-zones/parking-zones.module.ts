import { Module } from "@nestjs/common";
import { ParkingZonesController } from "./parking-zones.controller";
import { ParkingZonesService } from "./parking-zones.service";

@Module({
    controllers: [ParkingZonesController],
    providers: [ParkingZonesService],
})
export class ParkingZonesModule {}
