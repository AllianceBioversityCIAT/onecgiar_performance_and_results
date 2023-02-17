import { Route } from '@angular/router';
import { CheckLoginGuard } from '../guards/check-login.guard';

export const routingApp: PrRoute[] = [
  // { prName: 'Home', canActivate: [CheckLoginGuard], path: 'home', loadChildren: () => import('../../pages/home/home.module').then(m => m.HomeModule) },
  { prName: 'Results', underConstruction: false, canActivate: [CheckLoginGuard], path: 'result', loadChildren: () => import('../../pages/results/results.module').then(m => m.ResultsModule) },
  { prName: 'Type 1 report elements', underConstruction: true, onlytest: true, canActivate: [CheckLoginGuard], path: 'type-one-report', loadChildren: () => import('../../pages/type-one-report/type-one-report.module').then(m => m.TypeOneReportModule) },
  { prName: 'login', prHide: true, path: 'login', loadChildren: () => import('../../pages/login/login.module').then(m => m.LoginModule) },
  { prName: 'Quality Assurance', onlytest: false, underConstruction: false, canActivate: [CheckLoginGuard], path: 'quality-assurance', loadChildren: () => import('../../pages/quality-assurance/quality-assurance.module').then(m => m.QualityAssuranceModule) },
  { prName: 'INIT Admin Module', onlytest: false, prHide: false, path: 'init-admin-module', loadChildren: () => import('../../pages/init-admin-section/init-admin-section.module').then(m => m.InitAdminSectionModule) },
  { prName: '', path: '**', pathMatch: 'full', redirectTo: 'result', prHide: true }
];

export const extraRoutingApp: PrRoute[] = [{ prName: 'Admin module', onlytest: false, prHide: false, path: 'admin-module', loadChildren: () => import('../../pages/admin-section/admin-section.module').then(m => m.AdminSectionModule) }];

export const resultRouting: PrRoute[] = [
  { prName: 'Result Creator', path: 'result-creator', loadChildren: () => import('../../pages/results/pages/result-creator/result-creator.module').then(m => m.ResultCreatorModule) },
  { prName: 'Result detail', path: 'result-detail/:id', loadChildren: () => import('../../pages/results/pages/result-detail/result-detail.module').then(m => m.ResultDetailModule) },
  { prName: '', path: 'results-outlet', loadChildren: () => import('../../pages/results/pages/results-outlet/results-outlet.module').then(m => m.ResultsOutletModule) },
  { prName: '', path: '**', pathMatch: 'full', redirectTo: 'results-outlet' }
];

export const adminModuleRouting: PrRoute[] = [
  { prName: 'Completeness status', path: 'completeness-status', loadChildren: () => import('../../pages/admin-section/pages/completeness-status/completeness-status.module').then(m => m.CompletenessStatusModule) },
  { prName: 'User report', path: 'user-report', loadChildren: () => import('../../pages/admin-section/pages/user-report/user-report.module').then(m => m.UserReportModule) },
  { prName: '', path: '**', pathMatch: 'full', redirectTo: 'completeness-status' }
];

export const initadminModuleRouting: PrRoute[] = [
  { prName: 'Completeness status', path: 'init-completeness-status', loadChildren: () => import('../../pages/init-admin-section/pages/init-completeness-status/init-completeness-status.module').then(m => m.InitCompletenessStatusModule) },
  { prName: 'General results report', path: 'init-general-results-report', loadChildren: () => import('../../pages/init-admin-section/pages/init-general-results-report/init-general-results-report.module').then(m => m.InitGeneralResultsReportModule) },
  { prName: '', path: '**', pathMatch: 'full', redirectTo: 'init-completeness-status' }
];

export const resultsOutletRouting: PrRoute[] = [
  { prName: 'Notifications', path: 'results-notifications', loadChildren: () => import('../../pages/results/pages/results-outlet/pages/results-notifications/results-notifications.module').then(m => m.ResultsNotificationsModule) },
  { prName: '', path: 'results-list', loadChildren: () => import('../../pages/results/pages/results-outlet/pages/results-list/results-list.module').then(m => m.ResultsListModule) },
  { prName: '', path: '**', pathMatch: 'full', redirectTo: 'results-list' }
];
export const rdResultTypesPages: PrRoute[] = [
  { prName: 'CapDev info', path: 'cap-dev-info', prHide: 5, underConstruction: false, loadChildren: () => import('../../pages/results/pages/result-detail/pages/rd-result-types-pages/cap-dev-info/cap-dev-info.module').then(m => m.CapDevInfoModule) },
  { prName: 'Innovation Dev info', path: 'innovation-dev-info', prHide: 7, underConstruction: false, loadChildren: () => import('../../pages/results/pages/result-detail/pages/rd-result-types-pages/innovation-dev-info/innovation-dev-info.module').then(m => m.InnovationDevInfoModule) },
  { prName: 'Innovation use info', path: 'innovation-use-info', prHide: 2, underConstruction: false, loadChildren: () => import('../../pages/results/pages/result-detail/pages/rd-result-types-pages/innovation-use-info/innovation-use-info.module').then(m => m.InnovationUseInfoModule) },
  { prName: 'Knowledge Product info', path: 'knowledge-product-info', prHide: 6, underConstruction: false, loadChildren: () => import('../../pages/results/pages/result-detail/pages/rd-result-types-pages/knowledge-product-info/knowledge-product-info.module').then(m => m.KnowledgeProductInfoModule) },
  { prName: 'Policy change info', path: 'policy-change1-info', prHide: 1, underConstruction: false, loadChildren: () => import('../../pages/results/pages/result-detail/pages/rd-result-types-pages/policy-change-info/policy-change-info.module').then(m => m.PolicyChangeInfoModule) }
];

export const resultDetailRouting: PrRoute[] = [
  { prName: 'General information', path: 'general-information', underConstruction: false, loadChildren: () => import('../../pages/results/pages/result-detail/pages/rd-general-information/rd-general-information.module').then(m => m.RdGeneralInformationModule) },
  { prName: 'Theory of change', path: 'theory-of-change', underConstruction: false, loadChildren: () => import('../../pages/results/pages/result-detail/pages/rd-theory-of-change/rd-theory-of-change.module').then(m => m.RdTheoryOfChangeModule) },
  { prName: 'Partners', path: 'partners', underConstruction: false, loadChildren: () => import('../../pages/results/pages/result-detail/pages/rd-partners/rd-partners.module').then(m => m.RdPartnersModule) },
  { prName: 'Geographic location', path: 'geographic-location', underConstruction: false, loadChildren: () => import('../../pages/results/pages/result-detail/pages/rd-geographic-location/rd-geographic-location.module').then(m => m.RdGeographicLocationModule) },
  { prName: 'Links to results', path: 'links-to-results', underConstruction: false, loadChildren: () => import('../../pages/results/pages/result-detail/pages/rd-links-to-results/rd-links-to-results.module').then(m => m.RdLinksToResultsModule) },
  { prName: 'Evidence', path: 'evidences', underConstruction: false, loadChildren: () => import('../../pages/results/pages/result-detail/pages/rd-evidences/rd-evidences.module').then(m => m.RdEvidencesModule) },
  ...rdResultTypesPages,
  { prName: '', path: '**', pathMatch: 'full', redirectTo: 'general-information' }
];

export const TypePneReportRouting: PrRoute[] = [
  { prName: 'Fact sheet', path: 'fact-sheet', loadChildren: () => import('../../pages/type-one-report/pages/tor-fact-sheet/tor-fact-sheet.module').then(m => m.TorFactSheetModule) },
  { prName: 'Initiative progress & Key results', path: 'initiative-progress-and-key-results', loadChildren: () => import('../../pages/type-one-report/pages/tor-init-progress-and-key-results/tor-init-progress-and-key-results.module').then(m => m.TorInitProgressAndKeyResultsModule) },
  // { prName: 'Impact pathway integration - External partners', path: 'ipi-external-partners', loadChildren: () => import('../../pages/type-one-report/pages/tor-ipi-cgiar-portfolio-linkages/tor-ipi-cgiar-portfolio-linkages.module').then(m => m.TorIpiCgiarPortfolioLinkagesModule) },
  // { prName: 'Impact pathway integration - CGIAR portfolio linkages', path: 'ipi-cgiar-portfolio-linkages', loadChildren: () => import('../../pages/type-one-report/pages/tor-ipi-cgiar-portfolio-linkages/tor-ipi-cgiar-portfolio-linkages.module').then(m => m.TorIpiCgiarPortfolioLinkagesModule) },
  { prName: 'Impact pathway integration', path: 'impact-pathway-integration', loadChildren: () => import('../../pages/type-one-report/pages/tor-impact-pathway-integration/tor-impact-pathway-integration.module').then(m => m.TorImpactPathwayIntegrationModule) },
  { prName: 'Key result story', path: 'key-result-story', loadChildren: () => import('../../pages/type-one-report/pages/tor-key-result-story/tor-key-result-story.module').then(m => m.TorKeyResultStoryModule) },
  { prName: '', path: '**', pathMatch: 'full', redirectTo: 'fact-sheet' }
];

export interface PrRoute extends Route {
  prName: string;
  prHide?: boolean | number;
  underConstruction?: boolean | number;
  onlytest?: boolean;
}

// Impact Contribution, ningun other, Capacity change

/*
Policy Change
Innovation use
Capacity Sharing for Development <----
Knowledge Product <----
Innovation Development <----
*/
