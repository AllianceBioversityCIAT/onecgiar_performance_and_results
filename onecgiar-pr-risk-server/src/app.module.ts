import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSource } from './config/orm.config';
import { TestModuleModule } from './modules/test-module/test-module.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSource.options,
      keepConnectionAlive: true,
      autoLoadEntities: true,
    }),
    TestModuleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
