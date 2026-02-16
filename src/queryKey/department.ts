export const DEPARTMENT_QUERY_KEY = {
  COLLEGE: ["colleges"],
  DEPARTMENT: (college: string) => ["departments", college],
  SEARCHED_DEPARTMENT: (search: string) => ["searched-departments", search],
} as const;
