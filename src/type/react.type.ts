import { Dispatch, SetStateAction } from "react";

type ISetState = Dispatch<SetStateAction<string | undefined>>;

interface MenuInfo {
  key: string;
  keyPath: string[];
  /** @deprecated This will not support in future. You should avoid to use this */
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

export type { ISetState, MenuInfo };
