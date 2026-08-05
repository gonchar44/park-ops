import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CitiesModule } from "./cities/cities.module";
import { CountriesModule } from "./countries/countries.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { MunicipalitiesModule } from "./municipalities/municipalities.module";
import { ParkingZonesModule } from "./parking-zones/parking-zones.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        HealthModule,
        CountriesModule,
        MunicipalitiesModule,
        CitiesModule,
        ParkingZonesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
