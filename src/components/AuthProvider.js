import { useEffect, useState, createContext } from "react";
import keycloak from "@/lib/keycloak";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    keycloak: null,
    authenticated: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && keycloak) {
      // Prevent multiple initializations
      if (!keycloak.authenticated && !keycloak.authenticatedInitialized) {
        keycloak.authenticatedInitialized = true; // Custom flag to prevent re-init

        keycloak
          .init({
            onLoad: "login-required", // Options: 'login-required', 'check-sso'
            checkLoginIframe: false, // Disable if not needed
            enableLogging: true, // Enable for debugging
            pkceMethod: "S256", // Recommended for public clients
            flow: "standard", // OAuth2 flow
          })
          .then((authenticated) => {
            setAuth({
              keycloak: keycloak,
              authenticated: authenticated,
            });
            console.log(
              `User is ${authenticated ? "authenticated" : "not authenticated"}`
            );

            // Token refresh handling
            const refreshToken = setInterval(() => {
              console.log("Attempting to refresh token..."); // Debug log before token refresh
              keycloak
                .updateToken(1) // Refresh if token will expire in 10 seconds
                .then((refreshed) => {
                  if (refreshed) {
                    console.log("Token refreshed");
                  } else {
                    console.log(
                      "Token not refreshed, valid for",
                      Math.round(
                        keycloak.tokenParsed.exp +
                          keycloak.timeSkew -
                          new Date().getTime() / 1000
                      ),
                      "seconds"
                    );
                  }
                })
                .catch(() => {
                  console.error("Failed to refresh token");
                });
            }, 1000); // Check every 10 seconds

            // Cleanup on unmount
            return () => clearInterval(refreshToken);
          })
          .catch((error) => {
            console.error("Keycloak initialization error:", error);
          });
      }
    }
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
