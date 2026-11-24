"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  User,
  Crown,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Eye,
  X,
  Mail,
  Calendar,
} from "lucide-react";
import {
  getAllUsers,
  updateUserRole,
  seedInitialAdminUser,
  UserProfile,
  formatDate,
} from "@backend/index";
import { useAuth } from "@/context/AuthContext";

export default function AdminUsersPage() {
  const { user: currentUser, profile: currentProfile, refreshProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const fetchUsersList = async () => {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  const handleRoleToggle = async (targetUser: UserProfile) => {
    const newRole = targetUser.role === "admin" ? "customer" : "admin";
    setUpdatingUid(targetUser.uid);
    setMessage(null);
    try {
      await updateUserRole(targetUser.uid, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.uid === targetUser.uid ? { ...u, role: newRole } : u))
      );
      if (currentUser?.uid === targetUser.uid) {
        await refreshProfile();
      }
      setMessage(
        `Successfully updated ${targetUser.displayName || targetUser.email} to '${newRole}' role!`
      );
      if (selectedUser?.uid === targetUser.uid) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (err: any) {
      setMessage(`Error updating role: ${err.message || "Failed"}`);
    }
    setUpdatingUid(null);
  };

  const handleCreateSampleAdmin = async () => {
    setLoading(true);
    try {
      const seeded = await seedInitialAdminUser(
        currentUser?.email || "vedikadivine@gmail.com",
        currentProfile?.displayName || "Store Owner"
      );
      await fetchUsersList();
      setMessage(`Created admin document for '${seeded.email}' in Firestore 'users' collection!`);
    } catch (e: any) {
      setMessage(`Failed to create initial admin: ${e.message}`);
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.uid.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Firestore `users` Collection Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Users & Role Management
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Compact user rows • Click &ldquo;View Details&rdquo; for full profile or switch role between Customer and Admin.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchUsersList}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 transition-colors"
            title="Refresh Users"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleCreateSampleAdmin}
            className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-amber-950/60 transition-colors"
          >
            <Crown className="w-4 h-4 text-amber-200" />
            <span>Add Admin Doc</span>
          </button>
        </div>
      </div>

      {/* Guide Card */}
      <div className="p-4.5 rounded-2xl bg-amber-950/20 border border-amber-900/40 text-xs text-stone-300 space-y-1.5">
        <h3 className="font-bold text-amber-300 flex items-center gap-2 text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Role Control & Firebase Console Integration</span>
        </h3>
        <p className="text-stone-400 leading-relaxed text-[11px]">
          Every customer who registers is saved into Firestore <code>users/&#123;uid&#125;</code> with <code>role: &quot;customer&quot;</code>. You can promote any account to <code>admin</code> by clicking &ldquo;Make Admin&rdquo; below or by editing the field in your Firebase Console.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user by name, email, or UID..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500"
        />
      </div>

      {/* Compact Users Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-950/70 border-b border-stone-800 text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Current Role</th>
                <th className="py-3.5 px-4">Role Action</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-stone-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-500">
                    No users found in `users` collection.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isAdminUser = u.role === "admin";
                  const isUpdating = updatingUid === u.uid;

                  return (
                    <tr
                      key={u.uid}
                      className="hover:bg-stone-800/40 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-stone-800 border border-stone-700 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                            {u.displayName ? u.displayName[0].toUpperCase() : "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white text-xs truncate">
                              {u.displayName || "Customer"}
                            </p>
                            {currentUser?.uid === u.uid && (
                              <span className="text-[10px] text-amber-400 font-semibold">
                                (You)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 text-stone-300 font-mono text-[11px]">
                        {u.email || "No email"}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isAdminUser ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                            <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-800 text-stone-400 border border-stone-700">
                            <User className="w-3 h-3 text-stone-500" />
                            Customer
                          </span>
                        )}
                      </td>

                      {/* Role Toggle Button */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleRoleToggle(u)}
                          disabled={isUpdating}
                          className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-colors ${
                            isAdminUser
                              ? "bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700"
                              : "bg-amber-600 hover:bg-amber-500 text-white shadow-xs"
                          }`}
                        >
                          {isUpdating
                            ? "Updating..."
                            : isAdminUser
                            ? "Demote to Customer"
                            : "Make Admin 👑"}
                        </button>
                      </td>

                      {/* View Details Button */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1 ml-auto transition-colors"
                        >
                          <Eye className="w-3 h-3 text-amber-400" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  {selectedUser.displayName ? selectedUser.displayName[0].toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {selectedUser.displayName || "Customer Account"}
                  </h3>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${
                      selectedUser.role === "admin"
                        ? "bg-amber-950 text-amber-300 border-amber-800"
                        : "bg-stone-800 text-stone-400 border-stone-700"
                    }`}
                  >
                    Role: {selectedUser.role || "customer"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-300">
              <div className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500">
                  Firebase UID (Document ID)
                </span>
                <p className="font-mono text-amber-300 text-xs break-all">
                  {selectedUser.uid}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500">
                  Email Address
                </span>
                <p className="text-white text-xs flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  {selectedUser.email || "No email"}
                </p>
              </div>

              {selectedUser.phoneNumber && (
                <div className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500">
                    Phone Number
                  </span>
                  <p className="text-white text-xs">{selectedUser.phoneNumber}</p>
                </div>
              )}

              {selectedUser.createdAt && (
                <div className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500">
                    Account Registered
                  </span>
                  <p className="text-white text-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-800 flex justify-between items-center">
              <button
                onClick={() => handleRoleToggle(selectedUser)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors shadow-xs"
              >
                {selectedUser.role === "admin"
                  ? "Demote to Customer"
                  : "Promote to Admin 👑"}
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
