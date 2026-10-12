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

@Module({
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
export class AppModule {}