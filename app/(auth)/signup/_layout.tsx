import React, { createContext, useContext, useMemo, useState } from "react";
import { Stack } from "expo-router";
import { PaperProvider , MD3LightTheme } from "react-native-paper";

type SignupData = {
  firstName: string;
  lastName: string;
  email: string;

  country: string;
  countryCode: string;
  state: string;
  phoneCode: string;
  phoneNumber: string;
  nin?: string;

  password: string;
  confirmPassword: string;
  role: string;
};

const initial: SignupData = {
  firstName: "",
  lastName: "",
  email: "",
  country: "",
  countryCode: "",
  state: "",
  phoneCode: "+234",
  phoneNumber: "",
  nin: "",
  password: "",
  confirmPassword: "",
  role: "",
};

type Ctx = {
  data: SignupData;
  setData: React.Dispatch<React.SetStateAction<SignupData>>;
  update: (patch: Partial<SignupData>) => void;
};

const SignupCtx = createContext<Ctx | null>(null);

export const useSignup = () => {
  const ctx = useContext(SignupCtx);
  if (!ctx) throw new Error("useSignup must be used inside SignupProvider");
  return ctx;
};

function SignupProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SignupData>(initial);

  const value = useMemo(
    () => ({
      data,
      setData,
      update: (patch: Partial<SignupData>) => setData((p) => ({ ...p, ...patch })),
    }),
    [data]
  );

  return <SignupCtx.Provider value={value}>{children}</SignupCtx.Provider>;
}

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#ffffff',
    background:"#ffffff",
    outline: '#d1d5db', 
  },
  roundness: 6,
};

export default function SignupLayout() {
  return (
    <SignupProvider >
      <PaperProvider theme={theme}>
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>  
    </SignupProvider>
  );
}
