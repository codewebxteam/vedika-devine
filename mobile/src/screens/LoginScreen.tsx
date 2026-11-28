import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { colors, typography, spacing, borderRadius } from "../theme/colors";
import { LuxuryHeader } from "../components/LuxuryHeader";
import { GoldButton } from "../components/GoldButton";
import { RootStackParamList } from "../navigation/types";

type LoginNavProp = NativeStackNavigationProp<RootStackParamList>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavProp>();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      await login(email.trim(), password);
      navigation.goBack();
    } catch (err: any) {
      console.warn("Login failed:", err);
      let msg = "Invalid email or password. Please verify your credentials.";
      if (err.code === "auth/invalid-credential" || err.message?.includes("invalid-credential")) {
        msg = "Invalid email address or incorrect password.";
      } else if (err.code === "auth/user-not-found") {
        msg = "No account found with this email.";
      } else if (err.code === "auth/wrong-password") {
        msg = "Incorrect password. Please try again.";
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LuxuryHeader
        title="Royal Sign In"
        subtitle="Access your Vedika Sanctuary"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ENTER CREDENTIALS</Text>
          <Text style={styles.cardSub}>
            Sign in with your registered email and secure password.
          </Text>

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Email Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color={colors.gold.primary} />
              <TextInput
                style={styles.input}
                placeholder="e.g. royalty@vedikadivine.com"
                placeholderTextColor={colors.text.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color={colors.gold.primary} />
              <TextInput
                style={styles.input}
                placeholder="••••••••••••"
                placeholderTextColor={colors.text.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={18} color={colors.text.muted} />
                ) : (
                  <Eye size={18} color={colors.text.muted} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <View style={styles.buttonWrapper}>
            <GoldButton
              title="Sign In to Account"
              loading={loading}
              icon={<LogIn size={18} color="#000" />}
              onPress={handleLogin}
            />
          </View>
        </View>

        {/* Link to Register */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New to Vedika Divine?</Text>
          <TouchableOpacity onPress={() => navigation.replace("Register")}>
            <Text style={styles.footerLink}>Create Royal Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.lg,
  },
  cardTitle: {
    fontSize: 12,
    color: colors.gold.primary,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: 12,
    color: colors.status.error,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    height: 46,
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 14,
  },
  buttonWrapper: {
    marginTop: spacing.xs,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.gold.primary,
    textDecorationLine: "underline",
  },
});
