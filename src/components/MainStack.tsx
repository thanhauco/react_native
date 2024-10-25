import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";
import { TodoList } from "./TodoList";
import { Calendar } from "./Calendar";
import { useState, useEffect } from "react";
import { loginWithMicrosoft, loginWithCredentials, logout } from "../services/auth";
import { LoginForm } from "./LoginForm";
import { Dialogs } from "@nativescript/core";
import AsyncStorage from '@react-native-async-storage/async-storage';

const StackNavigator = stackNavigatorFactory();

export const MainStack = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user_data');
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.username);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await loginWithCredentials(username, password);
      if (result.success) {
        setUsername(result.user!.username);
        setIsAuthenticated(true);
      } else {
        await Dialogs.alert({
          title: "Login Failed",
          message: result.error || "Invalid credentials",
          okButtonText: "OK"
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      await Dialogs.alert({
        title: "Error",
        message: "An unexpected error occurred",
        okButtonText: "OK"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      setIsLoading(true);
      const result = await loginWithMicrosoft();
      setUsername(result.account.username);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Microsoft login failed:', error);
      await Dialogs.alert({
        title: "Error",
        message: "Microsoft login failed. Please try again.",
        okButtonText: "OK"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      setIsAuthenticated(false);
      setUsername("");
    } catch (error) {
      console.error('Logout failed:', error);
      await Dialogs.alert({
        title: "Error",
        message: "Logout failed. Please try again.",
        okButtonText: "OK"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <flexboxLayout className="h-full justify-center items-center">
        <activityIndicator busy={true} />
      </flexboxLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginForm 
        onLogin={handleCredentialsLogin}
        onMicrosoftLogin={handleMicrosoftLogin}
      />
    );
  }

  return (
    <BaseNavigationContainer>
      <StackNavigator.Navigator
        initialRouteName="TodoList"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#2563eb",
          },
          headerTintColor: "white",
        }}
      >
        <StackNavigator.Screen
          name="TodoList"
          component={TodoList}
          options={{
            title: `Todo List - ${username}`,
            headerRight: () => (
              <button 
                className="mr-4 text-white font-semibold"
                text="Logout" 
                onTap={handleLogout} 
              />
            ),
          }}
        />
        <StackNavigator.Screen
          name="Calendar"
          component={Calendar}
          options={{
            title: "Calendar",
          }}
        />
      </StackNavigator.Navigator>
    </BaseNavigationContainer>
  );
};