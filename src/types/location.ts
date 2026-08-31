// ─── Location Domain Type ───────────────────────────────────────────────────

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  assetsCount: number;
  employeesCount: number;
  type?: string;
}
