import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "./supabase";

export type AppRole = "admin" | "manager" | "employee";

type SignUpPayload = {
  email: string;
  password: string;
  fullName: string;
  restaurantName: string;
  role: AppRole;
};

type AuthContextValue = {
  isReady: boolean;
  session: Session | null;
  user: User | null;
  role: AppRole;
  isAdmin: boolean;
  displayName: string;
  restaurantName: string;
  restaurantId: string | null;
  needsAdminSetup: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (payload: { fullName: string }) => Promise<void>;
  completeAdminSetup: () => Promise<void>;
  skipAdminSetup: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeRole(user: User | null): AppRole {
  const rawRole =
    user?.app_metadata.role ?? user?.user_metadata.role ?? user?.user_metadata.requested_role ?? "employee";

  if (rawRole === "owner") {
    return "admin";
  }

  if (rawRole === "admin" || rawRole === "manager" || rawRole === "employee") {
    return rawRole;
  }

  return "employee";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        throw error;
      }

      if (isMounted) {
        setSession(data.session);
        setIsReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsReady(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const user = session?.user ?? null;
  const role = normalizeRole(user);
  const isAdmin = role === "admin";
  const displayName = (user?.user_metadata.full_name as string | undefined) ?? user?.email ?? "";
  const restaurantName = (user?.user_metadata.restaurant_name as string | undefined) ?? "";
  const restaurantId =
    (user?.app_metadata.restaurant_id as string | undefined) ??
    (user?.user_metadata.restaurant_id as string | undefined) ??
    null;
  const needsAdminSetup =
    isAdmin &&
    !Boolean(user?.user_metadata.system_setup_completed) &&
    !Boolean(user?.user_metadata.system_setup_skipped);

  const value = useMemo<AuthContextValue>(
    () => ({
      isReady,
      session,
      user,
      role,
      isAdmin,
      displayName,
      restaurantName,
      restaurantId,
      needsAdminSetup,
      async signIn(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          throw error;
        }
      },
      async signUp(payload: SignUpPayload) {
        const { error } = await supabase.auth.signUp({
          email: payload.email,
          password: payload.password,
          options: {
            data: {
              full_name: payload.fullName,
              restaurant_name: payload.restaurantName,
              requested_role: payload.role,
              role: payload.role,
              system_setup_completed: false,
              system_setup_skipped: payload.role === "admin" ? false : true,
            },
          },
        });

        if (error) {
          throw error;
        }
      },
      async updateProfile(payload: { fullName: string }) {
        const { error } = await supabase.auth.updateUser({
          data: {
            ...user?.user_metadata,
            full_name: payload.fullName,
          },
        });

        if (error) {
          throw error;
        }
      },
      async completeAdminSetup() {
        const { error } = await supabase.auth.updateUser({
          data: {
            ...user?.user_metadata,
            system_setup_completed: true,
            system_setup_skipped: false,
          },
        });

        if (error) {
          throw error;
        }
      },
      async skipAdminSetup() {
        const { error } = await supabase.auth.updateUser({
          data: {
            ...user?.user_metadata,
            system_setup_skipped: true,
          },
        });

        if (error) {
          throw error;
        }
      },
      async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
      },
    }),
    [displayName, isAdmin, isReady, needsAdminSetup, restaurantId, restaurantName, role, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
