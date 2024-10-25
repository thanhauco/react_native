import * as React from "react";
import { useState } from "react";

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  onMicrosoftLogin: () => void;
}

export function LoginForm({ onLogin, onMicrosoftLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (username && password) {
      onLogin(username, password);
    } else {
      setError("Please fill in all fields");
    }
  };

  return (
    <flexboxLayout className="h-full justify-center items-center bg-gray-50">
      <stackLayout className="w-4/5 space-y-4 bg-white p-6 rounded-xl shadow-md">
        <label className="text-2xl font-bold text-center text-gray-800" text="Login" />
        
        {error && (
          <label className="text-red-500 text-sm text-center" text={error} />
        )}

        <textField
          className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-base"
          hint="Username"
          text={username}
          onTextChange={(args) => setUsername(args.object.text)}
        />

        <textField
          className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-base"
          hint="Password"
          secure={true}
          text={password}
          onTextChange={(args) => setPassword(args.object.text)}
        />

        <button 
          className="p-3 bg-blue-600 text-white rounded-lg font-semibold"
          text="Login" 
          onTap={handleSubmit}
        />

        <stackLayout className="space-y-2">
          <label className="text-center text-gray-500" text="or" />
          <button 
            className="p-3 bg-gray-100 text-gray-800 rounded-lg font-semibold"
            text="Login with Microsoft" 
            onTap={onMicrosoftLogin}
          />
        </stackLayout>
      </stackLayout>
    </flexboxLayout>
  );
}