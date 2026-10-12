var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, envValidationSchema } from './config/index.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { SkillsModule } from './modules/skills/skills.module.js';
import { UserSkillsModule } from './modules/user-skills/user-skills.module.js';
import { EvidenceModule } from './modules/evidence/evidence.module.js';
import { AcknowledgementsModule } from './modules/acknowledgements/acknowledgements.module.js';
import { LevelsModule } from './modules/levels/levels.module.js';
import { DiscoveryModule } from './modules/discovery/discovery.module.js';
import { ConnectionsModule } from './modules/connections/connections.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { UploadsModule } from './modules/uploads/uploads.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                load: [appConfig],
                validationSchema: envValidationSchema,
            }),
            PrismaModule,
            AuthModule,
            UsersModule,
            SkillsModule,
            UserSkillsModule,
            EvidenceModule,
            AcknowledgementsModule,
            LevelsModule,
            DiscoveryModule,
            ConnectionsModule,
            NotificationsModule,
            UploadsModule,
        ],
        controllers: [AppController],
        providers: [AppService],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map