import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { User, Mail, Lock, Phone, UserPlus, Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { colors, typography, spacing, borderRadius } from "../theme/colors";
import { LuxuryHeader } from "../components/LuxuryHeader";
import { GoldButton } from "../components/GoldButton";
import { RootStackParamList } from "../navigation/types";

type RegisterNavProp = NativeStackNavigationProp<RootStackParamList>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterNavProp>();
  const { register } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    if (!displayName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      await register(email.trim(), password, displayName.trim(), phoneNumber.trim());
      navigation.goBack();
    } catch (err: any) {
      console.warn("Registration failed:", err);
      let msg = "Failed to create account. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        msg = "An account with this email already exists. Please sign in.";
      } else if (err.code === "auth/weak-password") {
        msg = "The password is too weak. Please use at least 6 characters.";
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LuxuryHeader
        title="Royal Registration"
        subtitle="Join our Community of Connoisseurs"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>CREATE NEW ACCOUNT</Text>
          <Text style={styles.cardSub}>
            Enjoy personalized orders, express COD checkout, and order tracking.
          </Text>

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Full Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputWrapper}>
              <User size={18} color={colors.gold.primary} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Maharani Ananya Sharma"
                placeholderTextColor={colors.text.muted}
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color={colors.gold.primary} />
              <TextInput
                style={styles.input}
                placeholder="e.g. ananya@example.com"
                placeholderTextColor={colors.text.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Phone Number */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number (Optional)</Text>
            <View style={styles.inputWrapper}>
              <Phone size={18} color={colors.gold.primary} />
              <TextInput
                style={styles.input}
                placeholder="e.g. 9876543210"
                placeholderTextColor={colors.text.muted}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Password (Min. 6 Characters) *</Text>
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

          {/* Register Button */}
          <View style={styles.buttonWrapper}>
            <GoldButton
              title="Create Account"
              loading={loading}
              icon={<UserPlus size={18} color="#000" />}
              onPress={handleRegister}
            />
          </View>
        </View>

        {/* Link to Login */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.replace("Login")}>
            <Text style={styles.footerLink}>Sign In Here</Text>
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
    paddingBottom: spacing.xxl,
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
