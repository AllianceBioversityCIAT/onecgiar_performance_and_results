import { TocModule } from './toc/toc.module';
import { ClarisaModule } from './clarisa/clarisa.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MainRoutes } from './main.routes';
import { ResultsModule } from './api/results/results.module';
import { HomeModule } from './api/home/home.module';
import { TypeOneReportModule } from './api/type-one-report/type-one-report.module';
import { dataSource } from './config/orm.config';
import { JwtMiddleware } from './auth/Middlewares/jwt.middleware';
import { UserModule } from './auth/modules/user/user.module';
import { RoleModule } from './auth/modules/role/role.module';
import { JwtService } from '@nestjs/jwt';
import { User } from './auth/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { HttpExceptionFilter } from './shared/handlers/error.exception';
import { ScheduleModule } from '@nestjs/schedule';
import { TocResultsModule } from './toc/toc-results/toc-results.module';
import { TocLevelModule } from './toc/toc-level/toc-level.module';
import { MQAPModule } from './api/m-qap/m-qap.module';
import { ElasticModule } from './elastic/elastic.module';

@Module({
  imports: [
    TocModule,
    ClarisaModule,
    AuthModule,
    HomeModule,
    ResultsModule,
    TypeOneReportModule,
    TypeOrmModule.forRoot({
      ...dataSource.options,
      keepConnectionAlive: true,
      autoLoadEntities: true,
    }),
    ClarisaModule,
    UserModule,
    RoleModule,
    MQAPModule,
    TypeOrmModule.forFeature([User]),
    ScheduleModule.forRoot(),
    TocLevelModule,
    TocResultsModule,
    RouterModule.register(MainRoutes),
    ElasticModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    JwtMiddleware,
    Repository,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes(
      {
        path: 'api/',
        method: RequestMethod.ALL,
      },
      {
        path: 'type-one-report',
        method: RequestMethod.ALL,
      },
    );
  }
}
