export interface Hook {
  CreateCode: string;
  Flags: number;
  HookApiVersion: number;
  // Each bit in this unsigned 256-bit integer indicates whether the Hook should execute on a particular transaction
  // type.
  //
  // More info: https://xrpl-hooks.readme.io/docs/hookon-field
  HookOn: string;
  // To avoid two or more Hooks installed on the same account unintentionally clobbering each-other's Hook State, a 32
  // byte namespace must be provided when creating or installing each Hook.
  //
  // The namespace may be any arbitrary 32 byte value the developer chooses. Provided the namespace is unique in the
  // Hook chain no state clobbering will occur.
  //
  // More info: https://xrpl-hooks.readme.io/docs/namespaces
  HookNamespace: string;
  // Hook developers may opt to use install-time parameters (called Hook Parameters) in their Hook. This allows
  // subsequent installers of the Hook to change certain behaviours the programmer defines without recompiling or
  // re-uploading the Hook (assuming at least one account still references the existing Hook Definition.)
  //
  // Hook Parameters are a set of Key-Value pairs set during the SetHook Transaction and retrievable by the Hook during runtime. Both the ParameterName (key) and the ParameterValue are set as hex blobs, and have a maximum length of 32 bytes and 256 bytes respectively.
  //
  // A SetHook Transaction may define up to 16 Hook Parameters per installed Hook.
  //
  // https://xrpl-hooks.readme.io/docs/parameters
  HookParameters?: HookParameter[];
  // A Grant permits a foreign XRPL account or Hook to modify the Hook State within the namespace of the specific Hook
  // for which the Grant is defined.
  //
  // If you wish to update a particular HookGrant whilst retaining multiple other HookGrant entires that were previously
  // set, you must first obtain the old HookGrants array, modify it, and then resubmit the entire array in an Update
  // Operation. To delete all Grants submit an empty HookGrants array.
  //
  // More info: https://xrpl-hooks.readme.io/docs/grants
  HookGrants?: HookGrant[];
}

export interface HookParameter {
  HookParameter: {
    HookParameterName: string;
    HookParameterValue: string;
  };
}

// Warning !!!
//
// Most Hook Developers will rarely need to use HookGrants, and should exercise extreme caution when granting state
// mutation permission to foreign Hooks and accounts.
//
// While a HookGrant cannot be used to directly steal funds, intentional external modification of a Hook's State may
// lead a Hook to behave in an unintended way, which in some cases could lead to a theft.
//
// If you think you need to use a Grant then please re-check your design first to ensure you actually need to use one
// before continuing.
//
// More info: https://xrpl-hooks.readme.io/docs/grants
export interface HookGrant {
  HookGrant: {
    HookHash: string;
    Authorize?: string;
  };
}
