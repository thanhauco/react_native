import { PublicClientApplication, Configuration, AuthenticationResult } from '@azure/msal-browser';
import { Dialogs } from "@nativescript/core";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants for storage
const USER_TOKEN_KEY = '@auth_token';
const USER_DATA_KEY = '@user_data';

// MSAL configuration
const msalConfig: Configuration = {
  auth: {
    clientId: 'YOUR_CLIENT_ID', // Replace with your actual Microsoft App Client ID
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: 'msauth://org.nativescript.app/callback',
    navigateToLoginRequestUrl: true
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: any, message: string, containsPii: boolean) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case 0:
            console.error(message);
            break;
          case 1:
            console.warn(message);
            break;
          case 2:
            console.info(message);
            break;
          case 3:
            console.debug(message);
            break;
        }
      },
      piiLoggingEnabled: false
    }
  }
};

// Initialize MSAL instance
let msalInstance: PublicClientApplication | null = null;

try {
  msalInstance = new PublicClientApplication(msalConfig);
} catch (error) {
  console.error('Failed to initialize MSAL:', error);
}

interface AuthResponse {
  success: boolean;
  user?: {
    username: string;
    isAdmin: boolean;
    token?: string;
  };
  error?: string;
}

// Local storage functions
const storeUserSession = async (token: string, userData: any) => {
  try {
    await AsyncStorage.setItem(USER_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user session:', error);
  }
};

const clearUserSession = async () => {
  try {
    await AsyncStorage.multiRemove([USER_TOKEN_KEY, USER_DATA_KEY]);
  } catch (error) {
    console.error('Error clearing user session:', error);
  }
};

// Admin credentials login
export const loginWithCredentials = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  try {
    // Simple admin authentication
    if (username === "admin" && password === "admin") {
      const userData = {
        username: "admin",
        isAdmin: true
      };
      
      // Store session data
      await storeUserSession('admin-token', userData);
      
      return {
        success: true,
        user: userData
      };
    }
    
    return {
      success: false,
      error: "Invalid credentials"
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: "An unexpected error occurred"
    };
  }
};

// Microsoft login
export const loginWithMicrosoft = async (): Promise<AuthenticationResult> => {
  if (!msalInstance) {
    throw new Error('MSAL not initialized');
  }

  try {
    // Check if there are any accounts signed in
    const accounts = await msalInstance.getAllAccounts();
    
    if (accounts.length > 0) {
      // Account exists, attempt silent token acquisition
      try {
        const silentRequest = {
          account: accounts[0],
          scopes: ['User.Read', 'Tasks.ReadWrite', 'Calendars.ReadWrite']
        };
        
        return await msalInstance.acquireTokenSilent(silentRequest);
      } catch (silentError) {
        console.warn('Silent token acquisition failed, falling back to interactive:', silentError);
      }
    }

    // No account exists or silent acquisition failed, proceed with interactive login
    return await msalInstance.loginPopup({
      scopes: ['User.Read', 'Tasks.ReadWrite', 'Calendars.ReadWrite'],
      prompt: 'select_account'
    });
  } catch (error) {
    console.error('Microsoft login failed:', error);
    await Dialogs.alert({
      title: "Login Error",
      message: "Failed to login with Microsoft. Please try again.",
      okButtonText: "OK"
    });
    throw error;
  }
};

// Logout function
export const logout = async (): Promise<void> => {
  try {
    if (msalInstance) {
      const accounts = await msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        await msalInstance.logout();
      }
    }
    await clearUserSession();
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};