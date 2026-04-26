export type UserRole = "admin" | "manager" | "employee";

export type EmployeeRecord = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  active: boolean;
};

export type AdminActionLogEntry = {
  id: string;
  actor: string;
  action: string;
  details: string;
  createdAt: string;
};

export type AdminConfiguration = {
  organizationName: string;
  kitchenName: string;
  preferences: {
    defaultPreparationLeadMinutes: number;
    autoAcceptReservations: boolean;
    lowStockAlerts: boolean;
  };
  featureToggles: {
    menuExtractionReview: boolean;
    floorLayoutEditing: boolean;
    reservationNotifications: boolean;
  };
  employees: EmployeeRecord[];
  actionLog: AdminActionLogEntry[];
};

const STORAGE_KEY_PREFIX = "klugk-admin-config";

function getStorageKey(userId: string) {
  return `${STORAGE_KEY_PREFIX}:${userId}`;
}

function buildDefaults(userEmail: string, displayName: string, restaurantName: string): AdminConfiguration {
  return {
    organizationName: restaurantName || "New restaurant organization",
    kitchenName: restaurantName ? `${restaurantName} Main Kitchen` : "Main Kitchen",
    preferences: {
      defaultPreparationLeadMinutes: 20,
      autoAcceptReservations: false,
      lowStockAlerts: true,
    },
    featureToggles: {
      menuExtractionReview: true,
      floorLayoutEditing: true,
      reservationNotifications: true,
    },
    employees: [
      {
        id: crypto.randomUUID(),
        name: displayName || "Account admin",
        email: userEmail,
        role: "admin",
        department: "Leadership",
        active: true,
      },
    ],
    actionLog: [],
  };
}

export function loadAdminConfiguration(
  userId: string,
  userEmail: string,
  displayName: string,
  restaurantName: string,
): AdminConfiguration {
  const storedValue = window.localStorage.getItem(getStorageKey(userId));
  if (!storedValue) {
    return buildDefaults(userEmail, displayName, restaurantName);
  }

  try {
    return JSON.parse(storedValue) as AdminConfiguration;
  } catch {
    return buildDefaults(userEmail, displayName, restaurantName);
  }
}

export function saveAdminConfiguration(userId: string, configuration: AdminConfiguration) {
  window.localStorage.setItem(getStorageKey(userId), JSON.stringify(configuration));
}

export function appendAdminActionLog(
  configuration: AdminConfiguration,
  actor: string,
  action: string,
  details: string,
): AdminConfiguration {
  return {
    ...configuration,
    actionLog: [
      {
        id: crypto.randomUUID(),
        actor,
        action,
        details,
        createdAt: new Date().toISOString(),
      },
      ...configuration.actionLog,
    ].slice(0, 25),
  };
}
