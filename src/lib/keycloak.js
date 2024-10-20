// lib/keycloak.js
import Keycloak from "keycloak-js";

// Keycloak configuration using environment variables
const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "intugine",
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "nextjs-app",
};

// Initialize Keycloak only once
let keycloak;

if (typeof window !== "undefined") {
  if (!global.keycloakInstance) {
    global.keycloakInstance = new Keycloak(keycloakConfig);
  }
  keycloak = global.keycloakInstance;
}

export default keycloak;
