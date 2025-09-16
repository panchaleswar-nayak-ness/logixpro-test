import { MarkoutFunctions } from 'src/app/common/constants/strings.constants';

export interface ButtonAccessItem {
  controlName: MarkoutFunction; 
  adminLevel: boolean;
}

export type MarkoutFunction = typeof MarkoutFunctions[keyof typeof MarkoutFunctions];

export interface AdminLevelChange {
  controlName: MarkoutFunction;
  adminLevel: boolean;
}
