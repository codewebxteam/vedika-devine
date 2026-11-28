import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Send,
} from "lucide-react-native";
import { colors, typography, spacing, borderRadius } from "../theme/colors";
import { LuxuryHeader } from "../components/LuxuryHeader";
import { GoldButton } from "../components/GoldButton";
import { RootStackParamList } from "../navigation/types";

type ContactNavProp = NativeStackNavigationProp<RootStackParamList>;

export const ContactScreen: React.FC = () => {
  const navigation = useNavigation<ContactNavProp>();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("Retail Pooja Samagri Order");
  const [message, setMessage] = useState("");

  const inquiryTypes = [
    "Retail Pooja Samagri Order",
    "Bulk / Mandir Gifting",
    "Distributor & Dealership",
    "Custom Fragrance Request",
  ];

  const handleSendWhatsApp = () => {
    if (!fullName.trim()) {
      Alert.alert("Missing Detail", "Please enter your name.");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Missing Detail", "Please enter your contact phone number.");
      return;
    }

    const formattedMessage =
      `*VEDIKA DIVINE - LUXURY CONCIERGE INQUIRY*\n\n` +
      `👤 *Client Name:* ${fullName.trim()}\n` +
      `📞 *Contact Number:* ${phone.trim()}\n` +
      `🏷️ *Inquiry Type:* ${inquiryType}\n` +
      (message.trim() ? `📝 *Message:* ${message.trim()}\n\n` : "\n") +
      `Sent via Vedika Divine Official Mobile Application`;

    const encoded = encodeURIComponent(formattedMessage);
    const targetPhone = "918874205655";
    Linking.openURL(`https://wa.me/${targetPhone}?text=${encoded}`).catch(() => {
      Alert.alert(
        "WhatsApp Not Found",
        "Unable to launch WhatsApp automatically. Please save +91 8874205655 and send your inquiry directly."
      );
    });
  };

  return (
    <View style={styles.container}>
      <LuxuryHeader
        title="Royal Concierge"
        subtitle="Direct WhatsApp Assistance & Support"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Quick Contact Info */}
        <View style={styles.infoBanner}>
          <View style={styles.infoRow}>
            <Phone size={16} color={colors.gold.primary} />
            <Text style={styles.infoText}>+91 8874205655 (Official Helpline)</Text>
          </View>
          <View style={styles.infoRow}>
            <Mail size={16} color={colors.gold.primary} />
            <Text style={styles.infoText}>support@vedikadivine.com</Text>
          </View>
          <View style={styles.infoRow}>
            <Clock size={16} color={colors.gold.primary} />
            <Text style={styles.infoText}>Mon - Sat: 9:00 AM - 7:00 PM</Text>
          </View>
        </View>

        {/* WhatsApp Inquiry Form */}
        <View style={styles.formCard}>
          <View style={styles.formTitleRow}>
            <MessageCircle size={20} color="#25D366" />
            <Text style={styles.formTitle}>DIRECT WHATSAPP INQUIRY</Text>
          </View>
          <Text style={styles.formSub}>
            Submit your requirements to chat immediately with our luxury concierge on WhatsApp.
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Your Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Vikramaditya Singh"
              placeholderTextColor={colors.text.muted}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>WhatsApp Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 9876543210"
              placeholderTextColor={colors.text.muted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Inquiry Type Radio Pills */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Inquiry Type</Text>
            <View style={styles.pillsContainer}>
              {inquiryTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typePill,
                    inquiryType === type && styles.typePillActive,
                  ]}
                  onPress={() => setInquiryType(type)}
                >
                  <Text
                    style={[
                      styles.typePillText,
                      inquiryType === type && styles.typePillTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Requirement / Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about the fragrances, quantities, or destination city..."
              placeholderTextColor={colors.text.muted}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* WhatsApp Submit Button */}
          <TouchableOpacity
            style={styles.whatsAppSubmitBtn}
            onPress={handleSendWhatsApp}
          >
            <MessageCircle size={20} color="#fff" />
            <Text style={styles.whatsAppSubmitText}>Send via Official WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Manufacturing Address */}
        <View style={styles.factoryCard}>
          <MapPin size={18} color={colors.gold.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.factoryTitle}>Craftsmanship Studio & Factory</Text>
            <Text style={styles.factoryText}>
              Vedika Divine Fragrances, RMPG Home Industries, Uttar Pradesh, India
            </Text>
          </View>
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
    paddingBottom: spacing.xxl,
  },
  infoBanner: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  infoText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  formCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  formTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: 4,
  },
  formTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.gold.primary,
    letterSpacing: 1,
  },
  formSub: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: spacing.md,
  },
  formGroup: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    height: 44,
    color: colors.text.primary,
    fontSize: 14,
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
    paddingTop: 8,
  },
  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  typePillActive: {
    backgroundColor: colors.gold.surface,
    borderColor: colors.gold.primary,
  },
  typePillText: {
    fontSize: 11,
    color: colors.text.muted,
  },
  typePillTextActive: {
    color: colors.gold.primary,
    fontWeight: "600",
  },
  whatsAppSubmitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25D366",
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  whatsAppSubmitText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  factoryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  factoryTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  factoryText: {
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 2,
  },
});
