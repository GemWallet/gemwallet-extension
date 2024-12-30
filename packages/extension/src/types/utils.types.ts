export type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type PartialExcept<Type, Key extends keyof Type> = Partial<Type> & Required<Pick<Type, Key>>;

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type DeepPartialExcept<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? T[P] : T[P] extends object ? DeepPartial<T[P]> : T[P] | undefined;
};
