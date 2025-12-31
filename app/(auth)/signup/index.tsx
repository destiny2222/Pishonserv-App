import { Redirect } from "expo-router";

export default function SignupIndex() {
  return <Redirect href="/(auth)/signup/step-1" />;
}
