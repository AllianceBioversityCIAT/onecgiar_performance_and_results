export class InnovationDevelopmentLinks {
  pictures: linkType[] = [{ link: '' }];
  reference_materials: linkType[] = [{ link: '' }];
}

export class linkType {
  id?: string = '';
  link: string = '';
  description?: string | null = null;
  result_id?: string = '';
  gender_related?: string | null = null;
  youth_related?: string | null = null;
  nutrition_related?: string | null = null;
  environmental_biodiversity_related?: string | null = null;
  poverty_related?: string | null = null;
  is_supplementary?: string | null = null;
  is_active?: number = 1;
  creation_date?: string = '';
  last_updated_date?: string = '';
  evidence_type_id?: string = '';
}
