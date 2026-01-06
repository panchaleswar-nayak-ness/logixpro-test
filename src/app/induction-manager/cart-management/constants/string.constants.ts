
export const CartStatus = {
    Inducting: 'Inducting' as const,
    Inducted: 'Inducted' as const,
    InProgress: 'In Progress' as const,
    Available: 'Available' as const,
    Inactive: 'Inactive' as const,
    All: 'All' as const
}

export const CartStatusClassMap = {
    [CartStatus.Inducting]: 'label-purple',
    [CartStatus.Inducted]: 'label-yellow',
    [CartStatus.InProgress]: 'label-blue2',
    [CartStatus.Available]: 'label-green',
    [CartStatus.Inactive]: 'label-red'
}

export const CartStatusTooltipText = `• Inducting: Cart is currently being built.
• Inducted: Cart is ready to go to a workstation.
• In-Progress: Totes in the cart are being filled at the workstation.
• Available: Cart is available to be inducted.
• Inactive: Cart is currently inactive.`;


export const CartDialogConstants = {
    title: 'Delete Cart'
}

export const TotePositionClasses = {
    EMPTY: 'position-empty bg-chrome-50',
    SELECTED: 'position-selected bg-primary-900',
    FILLED: 'position-filled bg-primary-50',
    DISABLED: 'position-disabled bg-chrome-50',
    ERROR: 'label-red',
    CLOSED: 'label-green'
}

export const TotePositionTextClasses = {
    DISABLED: 'text-chrome-600',
    ERROR: 'label-black',
    SELECTED: 'text-white',
    FILLED: 'text-tertiary-900',
    EMPTY: 'text-chrome-600'
}

export const CartManagementDialogConstants = {
    CART_ID_MAX_LENGTH: 50,
    TOTE_ID_MAX_LENGTH: 50,
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
}

export const DialogModes = {
  CREATE: 'create',
  EDIT: 'edit',
  VIEW: 'view'
} as const;

export const DialogTitles = {
  CREATE: 'Build New Cart',
  INDUCT: 'Induct Cart',
  EDIT: 'Edit Cart',
  VIEW: 'Cart Details',
  DEFAULT: 'Cart Management'
} as const;

export const PrimaryButtonTexts = {
  CREATE: 'Complete Cart',
  EDIT: 'Done',
  VIEW: 'Close',
  DEFAULT: 'Save'
} as const;

export const ClearButtonTexts = {
  CREATE: 'Clear All Totes',
  EDIT: 'Clear All Totes',
  DEFAULT: 'Clear All'
} as const;


export const BuildNewCartActionResults = {
  CLOSE:'close',
  UPDATE:'update'
}

export const ToteStatuses = {
  Closed: 'Closed',
  Started: 'Started' 
}

export const CartActivationDialog = {
  DeactivateHeading: 'Deactivate Cart?',
  DeactivateMessage: `Are you sure you want to deactivate this cart? It won't appear for induction again unless you activate it.`,
  ActivateHeading: 'Activate Cart?',
  ActivateMessage: 'Are you sure you want to activate this cart?'
} as const;

export const CartActivationToastMessages = {
  DeactivateSuccess: 'Cart deactivated successfully',
  DeactivateFailed: 'Failed to deactivate cart',
  ActivateSuccess: 'Cart activated successfully',
  ActivateFailed: 'Failed to activate cart'
} as const;