export interface Tag {
  _id?: string;
  label: string;
  type: string;
  belongToLabel: string[];
  selected?: boolean;
  createdById?: string;
}
