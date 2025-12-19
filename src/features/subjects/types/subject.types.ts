export type Degree = 'INGENIERIA_INFORMATICA' | 'INGENIERIA_INDUSTRIAL'
export type SubjectStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'

export interface Subject {
  id: number
  code: string
  name: string
  displayName: string
  degree: Degree
  status: SubjectStatus
  currentGroupCount: number
  active: boolean
  archived: boolean
  canCreateGroup: boolean
  createdAt: string
  updatedAt: string
}

export interface SubjectFilters {
  code?: string
  searchTerm?: string
  degree?: Degree
  status?: SubjectStatus
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}
