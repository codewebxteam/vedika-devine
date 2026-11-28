import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  User,
  Package,
  Heart,
  Truck,
  MessageCircle,
  Briefcase,
  Store,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Crown,
  Sparkles,
} from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { colors, typography, spacing, borderRadius } from "../theme/colors";
import { LuxuryHeader } from "../components/LuxuryHeader";
import { GoldButton } from "../components/GoldButton";
import { RootStackParamList } from "../navigation/types";

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavProp>();
  const { user, profile, isDealer, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you wish to exit your Vedika Divine account?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      "Namaste Vedika Divine Concierge! I need assistance regarding sacred pooja samagri or wholesale distribution."
    );
    Linking.openURL(`https://wa.me/918874205655?text=${text}`);
  };

  return (
    <View style={styles.container}>
      <LuxuryHeader
        title="Royal Sanctuary"
        subtitle={user ? "Account & Field Settings" : "Guest Sanctuary"}
        showBack={false}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        {user ? (
          <View style={styles.userCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : "V"}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{profile?.displayName || "Valued Customer"}</Text>
                {(isDealer || isAdmin) && (
                  <View style={styles.roleBadge}>
                    <Crown size={12} color="#000" />
                    <Text style={styles.roleBadgeText}>
                      {isAdmin ? "ADMIN" : "DISTRIBUTOR"}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.userEmail}>{user.email}</Text>
              {profile?.phoneNumber && (
                <Text style={styles.userPhone}>{profile.phoneNumber}</Text>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.guestCard}>
            <View style={styles.guestIconCircle}>
              <User size={36} color={colors.gold.primary} />
            </View>
            <Text style={styles.guestTitle}>Welcome to Vedika Divine</Text>
            <Text style={styles.guestSubtitle}>
              Sign in to manage orders, addresses, and access exclusive privileges.
            </Text>
            <View style={styles.authButtonsRow}>
              <TouchableOpacity
                style={styles.signInBtn}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.signInBtnText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerBtn}
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={styles.registerBtnText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Distributor Exclusive Hub (Visible for Dealers & Admins) */}
        {(isDealer || isAdmin) && (
          <View style={styles.dealerSection}>
            <View style={styles.dealerHeader}>
              <Briefcase size={20} color={colors.gold.primary} />
              <View>
                <Text style={styles.dealerTitle}>DISTRIBUTOR PORTAL (वितरक हब)</Text>
                <Text style={styles.dealerSubtitle}>10% Commission Field POS & Retailer Directory</Text>
              </View>
            </View>

            <View style={styles.dealerActionsGrid}>
              <TouchableOpacity
                style={styles.dealerActionCard}
                onPress={() => navigation.navigate("DealerDashboard")}
              >
                <Store size={22} color={colors.gold.primary} />
                <Text style={styles.dealerActionTitle}>Field Dashboard</Text>
                <Text style={styles.dealerActionSub}>Turnover & Commission</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dealerActionCard}
                onPress={() => navigation.navigate("DealerPOS")}
              >
                <Sparkles size={22} color={colors.gold.primary} />
                <Text style={styles.dealerActionTitle}>Book Shop Order</Text>
                <Text style={styles.dealerActionSub}>COD Field Engine</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dealerActionCard}
                onPress={() => navigation.navigate("DealerShops")}
              >
                <Package size={22} color={colors.gold.primary} />
                <Text style={styles.dealerActionTitle}>My Retail Shops</Text>
                <Text style={styles.dealerActionSub}>1-Click Repeat Orders</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dealerActionCard}
                onPress={() => navigation.navigate("DealerCommission")}
              >
                <Crown size={22} color={colors.gold.primary} />
                <Text style={styles.dealerActionTitle}>Commission Ledger</Text>
                <Text style={styles.dealerActionSub}>Admin Payout Status</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* App Navigation Links */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeader}>CUSTOMER SERVICES</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("MainTabs", { screen: "OrdersTab" } as any)}
          >
            <View style={styles.menuLeft}>
              <Package size={18} color={colors.gold.primary} />
              <Text style={styles.menuLabel}>Order History</Text>
            </View>
            <ChevronRight size={18} color={colors.text.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("TrackOrder")}
          >
            <View style={styles.menuLeft}>
              <Truck size={18} color={colors.gold.primary} />
              <Text style={styles.menuLabel}>Track Any Order</Text>
            </View>
            <ChevronRight size={18} color={colors.text.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Wishlist")}
          >
            <View style={styles.menuLeft}>
              <Heart size={18} color={colors.gold.primary} />
              <Text style={styles.menuLabel}>Royal Wishlist</Text>
            </View>
            <ChevronRight size={18} color={colors.text.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Wholesale")}
          >
            <View style={styles.menuLeft}>
              <Briefcase size={18} color={colors.gold.primary} />
              <Text style={styles.menuLabel}>Wholesale Master Cartons</Text>
            </View>
            <ChevronRight size={18} color={colors.text.muted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleWhatsApp}>
            <View style={styles.menuLeft}>
              <MessageCircle size={18} color="#25D366" />
              <Text style={styles.menuLabel}>WhatsApp Luxury Concierge</Text>
            </View>
            <ChevronRight size={18} color={colors.text.muted} />
          </TouchableOpacity>
        </View>

        {/* Brand Information */}
        <View style={styles.brandFooter}>
          <Text style={styles.brandTitle}>VEDIKA DIVINE - SACRED POOJA SAMAGRI</Text>
          <Text style={styles.brandSubtitle}>
            A Sacred Vedic Craftsmanship Initiative by RMPG Industries
          </Text>
          <Text style={styles.brandVersion}>App Version 1.0.0 (Expo SDK 52)</Text>
        </View>

        {/* Logout Button */}
        {user && (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={16} color={colors.status.error} />
            <Text style={styles.logoutBtnText}>Sign Out from Sanctuary</Text>
          </TouchableOpacity>
        )}
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
    paddingBottom: spacing.xxl,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gold.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: 2,
    flexWrap: "wrap",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    gap: 3,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000",
  },
  userEmail: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  userPhone: {
    fontSize: 12,
    color: colors.gold.primary,
    marginTop: 2,
  },
  guestCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  guestIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.gold.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.gold,
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 4,
  },
  guestSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  authButtonsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    width: "100%",
  },
  signInBtn: {
    flex: 1,
    backgroundColor: colors.gold.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  signInBtnText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 13,
  },
  registerBtn: {
    flex: 1,
    backgroundColor: colors.gold.surface,
    borderWidth: 1,
    borderColor: colors.border.gold,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  registerBtnText: {
    color: colors.gold.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  dealerSection: {
    backgroundColor: "rgba(217, 119, 6, 0.08)",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.gold,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  dealerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dealerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.gold.primary,
    letterSpacing: 0.5,
  },
  dealerSubtitle: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  dealerActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  dealerActionCard: {
    width: "48%",
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.sm,
    gap: 4,
  },
  dealerActionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.text.primary,
    marginTop: 4,
  },
  dealerActionSub: {
    fontSize: 10,
    color: colors.text.muted,
  },
  menuSection: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.gold.primary,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  menuLabel: {
    fontSize: 14,
    color: colors.text.primary,
  },
  brandFooter: {
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  brandTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.gold.primary,
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 2,
  },
  brandVersion: {
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  logoutBtnText: {
    color: colors.status.error,
    fontSize: 13,
    fontWeight: "600",
  },
});
