export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  departmentId?: string;
  /** Office / site location, e.g. "HQ — Bengaluru" */
  location: string;
  locationId?: string;
  email: string;
  joinedDate: string;
  phone?: string;
  employmentType?: string;
  accessRole?: string;
  notes?: string;
  /** Background gradient or hex color for avatar circle */
  avatarBg?: string;
}


