// ─── Department Domain Type ───────────────────────────────────────────────────

export interface Department {
  id: string;
  name: string;
  /** 2-letter uppercase badge code, e.g. "EN", "DE", "OP" */
  code: string;
  /** Full name of Department Head, e.g. "Priya Sharma" */
  head: string;
  /** Total count of staff members in department */
  membersCount: number;
  /** Total count of company assets assigned to department */
  assetsCount: number;
  /** CSS background or gradient for the 2-letter badge */
  badgeBg?: string;
  /** Primary facility location */
  primaryLocation?: string;
  /** Parent organizational unit */
  parentDepartment?: string;
  /** Financial cost centre identifier, e.g. "CC-4021" */
  costCenterCode?: string;
  /** Overview of department scope and responsibility */
  description?: string;
}
