import { Routes } from '@nestjs/core';
import { HomeModule } from './home/home.module';
import { ResultsModule } from './results/results.module';
import { ResultsRoutes } from './results/results.routes';
import { TypeOneReportModule } from './type-one-report/type-one-report.module';
import { ClarisaConnectionsModule } from '../clarisa/clarisa-connections/clarisa-connections.module';
import { typeOneReportRoutes } from './type-one-report/type-one-report.routes';

export const ModulesRoutes: Routes = [
  {
    path: 'home',
    module: HomeModule,
  },
  {
    path: 'results',
    module: ResultsModule,
    children: ResultsRoutes,
  },
  {
    path: 'type-one-report',
    module: TypeOneReportModule,
    children: typeOneReportRoutes,
  },
  {
    path:'clarisa',
    module: ClarisaConnectionsModule
  }
];
