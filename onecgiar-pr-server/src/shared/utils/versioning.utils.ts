export const VERSIONING = {
  QUERY: {
    Get_result_phases: (result_id: string, phase_id: number): string =>
      `IFNULL((select id from \`result\` r2 WHERE  r2.result_code = (SELECT r.result_code  from \`result\` r where r.id = ${result_id} and is_active > 0) and r2.version_id = ${phase_id} LIMIT 1), ${result_id})`,
    Get_kp_phases: (result_id: number): string =>
      `(SELECT rkp.result_knowledge_product_id  from results_knowledge_product rkp where rkp.results_id = ${result_id} and rkp.is_active > 0 LIMIT 1)`,
    Get_link_result_qa: (
      result_id: string,
    ): string => `IFNULL((select r.id from \`result\` r where r.result_code = ${result_id} and r.status_id = 2 and r.is_active > 0 and r.version_id = (SELECT MAX(r2.version_id)
    FROM \`result\` r2
    WHERE r2.result_code = ${result_id}
      AND r2.status_id = 2
      and r2.is_active > 0)), ${result_id})`,
    Get_r_ip_r_id: (): string => `select rbip2.result_by_innovation_package_id  
    from result_by_innovation_package rbip2 
    WHERE rbip2.is_active > 0 
      AND rbip2.ipsr_role_id = 1 
      AND rbip2.result_innovation_package_id = ? 
    LIMIT 1`,
  },
};
