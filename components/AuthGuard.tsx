import { UserContext } from "@/contexts/UserContext";
import { useRouter, useSegments } from "expo-router";
import { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useContext(UserContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";
    const inRootGroup = segments[0] === "(root)";

    // Define public routes that guests can access
    const publicRoutes = ["home", "search", "cart", "furniture", "properties"];

    // Check if current route is public
    const currentRoute = segments[segments.length - 1];
    const isPublicRoute = publicRoutes.includes(currentRoute);

    // Protected routes that require authentication
    const protectedRoutes = [
      "editprofile",
      "security",
      "transactions",
      "orders",
      "help",
    ];
    const isProtectedRoute = protectedRoutes.some((route) =>
      segments.includes(route),
    );

    // Redirect unauthenticated users only if they're trying to access protected routes
    if (!isAuthenticated && !inAuthGroup && !inOnboarding) {
      if (isProtectedRoute) {
        router.replace("/(auth)/login");
      }
      // Allow access to public routes without authentication
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(root)/(tabs)/home");
    }
  }, [isAuthenticated, isLoading, segments]);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
