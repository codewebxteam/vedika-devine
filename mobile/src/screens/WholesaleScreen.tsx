import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Briefcase,
  Box,
  Percent,
  Truck,
  ShieldCheck,
  MessageCircle,
  Store,
  CheckCircle2,
} from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { colors, typography, spacing, borderRadius } from "../theme/colors";
import { LuxuryHeader } from "../components/LuxuryHeader";
import { GoldButton } from "../components/GoldButton";
import { RootStackParamList } from "../navigation/types";

type WholesaleNavProp = NativeStackNavigationProp<RootStackParamList>;

export const WholesaleScreen: React.FC = () => {
  const navigation = useNavigation<WholesaleNavProp>();
  const { isDealer, isAdmin } = useAuth();

  const handleWhatsAppWholesale = (packType: string) => {
    const text = encodeURIComponent(
      `*VEDIKA DIVINE - WHOLESALE MASTER CARTON INQUIRY*\n\n` +
      `📦 *Carton Type:* ${packType}\n` +
      `🏭 *Inquiry:* Requesting wholesale factory pricing, MOQ catalog, and delivery schedule to my city.\n\n` +
      `Sent via Vedika Divine Official App`
    );
    Linking.openURL(`https://wa.me/918874205655?text=${text}`);
  };

  return (
    <View style={styles.container}>
      <LuxuryHeader
        title="Wholesale Supply"
        subtitle="Factory-Direct Master Cartons & B2B"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Box size={32} color={colors.gold.primary} />
          <Text style={styles.heroTitle}>Master Carton Factory Supply</Text>
          <Text style={styles.heroSubtitle}>
            Supply your retail store, pooja bhandar, or distributor network with pure Pooja Samagri, Bhimseni Kapur, Ghee Diyas & Divine living cartons.
          </Text>
        </View>

        {/* Benefits Grid */}
        <View style={styles.benefitsGrid}>
          <View style={styles.benefitItem}>
            <Percent size={20} color={colors.gold.primary} />
            <Text style={styles.benefitTitle}>35% - 40% Margin</Text>
            <Text style={styles.benefitDesc}>Exceptional retail profitability</Text>
          </View>
          <View style={styles.benefitItem}>
            <Truck size={20} color={colors.gold.primary} />
            <Text style={styles.benefitTitle}>Pan-India Freight</Text>
            <Text style={styles.benefitDesc}>Doorstep transport delivery</Text>
          </View>
          <View style={styles.benefitItem}>
            <Box size={20} color={colors.gold.primary} />
            <Text style={styles.benefitTitle}>Heavy Master Box</Text>
            <Text style={styles.benefitDesc}>Zero breakage honeycomb packing</Text>
          </View>
          <View style={styles.benefitItem}>
            <ShieldCheck size={20} color={colors.gold.primary} />
            <Text style={styles.benefitTitle}>100% Pure Soy</Text>
            <Text style={styles.benefitDesc}>Zero paraffin toxic chemicals</Text>
          </View>
        </View>

        {/* Master Carton Packs */}
        <Text style={styles.sectionHeader}>MASTER CARTON CONFIGURATIONS</Text>

        {/* Pack 1: 24 Pcs */}
        <View style={styles.packCard}>
          <View style={styles.packTop}>
            <View>
              <Text style={styles.packTitle}>Starter Boutique Carton (24 Units)</Text>
              <Text style={styles.packSubtitle}>Ideal for Spas, Salons & Boutique Gift Shops</Text>
            </View>
            <View style={styles.moqPill}>
              <Text style={styles.moqText}>MOQ: 1 Box</Text>
            </View>
          </View>

          <View style={styles.featuresList}>
            <View style={styles.featureRow}>
              <CheckCircle2 size={14} color={colors.gold.primary} />
              <Text style={styles.featureText}>Assorted Signature Fragrance Jars (6 fragrances x 4)</Text>
            </View>
            <View style={styles.featureRow}>
              <CheckCircle2 size={14} color={colors.gold.primary} />
              <Text style={styles.featureText}>Multi-ply reinforced damage-proof packaging</Text>
            </View>
            <View style={styles.featureRow}>
              <CheckCircle2 size={14} color={colors.gold.primary} />
              <Text style={styles.featureText}>Full GST invoice & input credit available</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.orderCartonBtn}
            onPress={() => handleWhatsAppWholesale("24 Units Boutique Carton")}
          >
            <MessageCircle size={16} color="#fff" />
            <Text style={styles.orderCartonText}>Inquire for 24-Pack via WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Pack 2: 48 Pcs */}
        <View style={styles.packCard}>
          <View style={styles.packTop}>
            <View>
              <Text style={styles.packTitle}>Retail Master Carton (48 Units)</Text>
              <Text style={styles.packSubtitle}>For High-Turnover Retail Stores & Distributors</Text>
            </View>
            <View style={[styles.moqPill, { backgroundColor: colors.gold.primary }]}>
              <Text style={[styles.moqText, { color: "#000" }]}>BEST MARGIN</Text>
            </View>
          </View>

          <View style={styles.featuresList}>
            <View style={styles.featureRow}>
              <CheckCircle2 size={14} color={colors.gold.primary} />
              <Text style={styles.featureText}>Maximum factory volume discount tier</Text>
            </View>
            <View style={styles.featureRow}>
              <CheckCircle2 size={14} color={colors.gold.primary} />
              <Text style={styles.featureText}>Full freedom to customize aroma blends</Text>
            </View>
            <View style={styles.featureRow}>
              <CheckCircle2 size={14} color={colors.gold.primary} />
              <Text style={styles.featureText}>Complimentary retail tester jars included</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.orderCartonBtn}
            onPress={() => handleWhatsAppWholesale("48 Units Retail Master Carton")}
          >
            <MessageCircle size={16} color="#fff" />
            <Text style={styles.orderCartonText}>Inquire for 48-Pack via WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* If Distributor, Show Quick Switch to Field POS */}
        {(isDealer || isAdmin) && (
          <View style={styles.dealerNoticeCard}>
            <Store size={22} color={colors.gold.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.dealerNoticeTitle}>Are you a Registered Distributor?</Text>
              <Text style={styles.dealerNoticeSub}>
                Book retail dukan orders directly with 10% commission on the Field POS screen.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.openPosBtn}
              onPress={() => navigation.navigate("DealerPOS")}
            >
              <Text style={styles.openPosText}>Open POS</Text>
            </TouchableOpacity>
          </View>
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
  heroCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginTop: spacing.xs,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 18,
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  benefitItem: {
    width: "48%",
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.sm,
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.text.primary,
    marginTop: 4,
  },
  benefitDesc: {
    fontSize: 10,
    color: colors.text.muted,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.gold.primary,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  packCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  packTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  packTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  packSubtitle: {
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 2,
  },
  moqPill: {
    backgroundColor: colors.gold.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.border.gold,
  },
  moqText: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.gold.primary,
  },
  featuresList: {
    gap: 6,
    marginBottom: spacing.md,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  orderCartonBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25D366",
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    gap: 6,
  },
  orderCartonText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fff",
  },
  dealerNoticeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold.surface,
    borderWidth: 1,
    borderColor: colors.border.gold,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  dealerNoticeTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.gold.primary,
  },
  dealerNoticeSub: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 2,
  },
  openPosBtn: {
    backgroundColor: colors.gold.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.sm,
  },
  openPosText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000",
  },
});
