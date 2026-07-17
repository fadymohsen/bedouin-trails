"use client";

import { useRef, useState } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { FaEnvelope, FaPhoneAlt, FaLock, FaTimes, FaCamera, FaEye, FaEyeSlash } from "react-icons/fa";
import { ApiClientError } from "@/lib/api-client";
import styles from "./profile.module.scss";

export type ProfileUser = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  image: string | null;
};

async function apiFormPut(url: string, form: FormData) {
  const res = await fetch(url, { method: "PUT", body: form, credentials: "same-origin" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status === false) throw new ApiClientError(data.message || "Something went wrong.");
  return data;
}

async function apiJsonPut(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status === false) throw new ApiClientError(data.message || "Something went wrong.");
  return data;
}

export default function ProfileClient({ user }: { user: ProfileUser }) {
  const t = useTranslations();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [userData, setUserData] = useState(user);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone ?? "",
    email: user.email,
  });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", password: "", passwordConfirmation: "" });
  const [showPasswords, setShowPasswords] = useState({ currentPassword: false, password: false, passwordConfirmation: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handlePasswordFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setErrors({ image: t("please_select_image_only") });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ image: t("image_size_error") });
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setErrors((prev) => ({ ...prev, image: "" }));
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const form = new FormData();
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("phone", formData.phone);
      form.append("email", formData.email);
      if (selectedImage) form.append("image", selectedImage);

      const res = await apiFormPut("/api/profile", form);
      setUserData(res.user);
      setSuccessMessage(t("data_updated_successfully"));
      setSelectedImage(null);
      setImagePreview(null);
      setEditMode(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrors({ general: err instanceof ApiClientError ? err.message : t("error_updating_data") });
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    if (!passwordData.currentPassword) return setErrors({ currentPassword: t("current_password_required") });
    if (!passwordData.password) return setErrors({ password: t("new_password_required") });
    if (passwordData.password.length < 8) return setErrors({ password: t("new_password_min_length") });
    if (passwordData.password !== passwordData.passwordConfirmation) {
      return setErrors({ passwordConfirmation: t("passwords_not_matching") });
    }

    setSaving(true);
    try {
      await apiJsonPut("/api/profile/password", {
        currentPassword: passwordData.currentPassword,
        password: passwordData.password,
      });
      setSuccessMessage(t("password_changed_successfully"));
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", password: "", passwordConfirmation: "" });
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrors({ general: err instanceof ApiClientError ? err.message : t("error_changing_password") });
    } finally {
      setSaving(false);
    }
  }

  function togglePasswordVisibility(field: keyof typeof showPasswords) {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/user/logout", { method: "POST", credentials: "same-origin" });
    } finally {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.coverHeader}>
        <div className={styles.headerButtons}>
          <div className={styles.card_nav}>
            {!editMode ? (
              <button className={styles.text} onClick={() => setEditMode(true)}>
                {t("edit_account_data")}
              </button>
            ) : (
              <div></div>
            )}
            <div className={styles.backBtn} onClick={() => router.back()}>
              <button className={styles.btn} aria-label="Back"></button>
              <div className={styles.border} />
              <div className={styles.text}>{t("personal_account")}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.pageBody}>
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            <img
              className={styles.userImage}
              src={imagePreview || userData.image || "/img/profile-img.png"}
              alt={`${userData.firstName} profile picture`}
            />
          </div>
          {editMode && (
            <label className={styles.imageUploadBtn} htmlFor="imageUpload">
              <FaCamera className={styles.cameraIcon} />
            </label>
          )}
          <input id="imageUpload" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />
          {errors.image && <div className={styles.errorMessage}>{errors.image}</div>}
        </div>

        <h2 className={styles.mainTitle}>{t("personal_data")}</h2>
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
        {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}

        <form ref={formRef} id="profileForm" onSubmit={handleProfileSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.nameRow}>
              <div className={styles.fieldGroup}>
                <label>{t("first_name")}</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className={`${errors.firstName ? styles.error : ""} ${editMode ? styles.edit : ""}`}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>{t("last_name")}</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className={`${errors.lastName ? styles.error : ""} ${editMode ? styles.edit : ""}`}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label>{t("email")}</label>
              <div className={styles.inputWithIcon}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className={`${errors.email ? styles.error : ""} ${editMode ? styles.edit : ""}`}
                />
                <FaEnvelope className={styles.fieldIcon} />
              </div>
              {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label>{t("mobile_number")}</label>
              <div className={styles.inputWithIcon}>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className={`${errors.phone ? styles.error : ""} ${editMode ? styles.edit : ""}`}
                />
                <FaPhoneAlt className={styles.fieldIcon} />
              </div>
              {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label>{t("password")}</label>
              {editMode ? (
                <div className={`${styles.inputWithIcon} ${styles.clickable}`} onClick={() => setShowPasswordModal(true)} style={{ cursor: "pointer" }}>
                  <input type="password" placeholder="********" readOnly />
                  <FaLock className={styles.fieldIcon} />
                </div>
              ) : (
                <div className={`${styles.inputWithIcon} ${styles.disabled}`}>
                  <input style={{ cursor: "pointer" }} type="password" placeholder="********" readOnly />
                  <FaLock className={styles.fieldIcon} />
                </div>
              )}
              <small className={styles.passwordHint}>{editMode ? t("click_to_change_password") : t("not_changeable_in_view_mode")}</small>
            </div>
          </div>

          <div className={styles.actionButtons}>
            {editMode ? (
              <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? t("saving") : t("save_changes")}
              </button>
            ) : (
              <button type="button" className={styles.logoutBtn} onClick={() => setShowLogoutModal(true)}>
                {t("logout")}
              </button>
            )}
          </div>
        </form>
      </div>

      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.passwordModalContent}>
            <button className={styles.closeBtn} onClick={() => setShowPasswordModal(false)}>
              <FaTimes />
            </button>
            <h3 className={styles.modalTitle}>{t("change_password")}</h3>
            {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}

            <form onSubmit={handlePasswordSubmit}>
              <div className={styles.passwordFields}>
                <div className={styles.passwordField}>
                  <label>{t("current_password")}</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showPasswords.currentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordFieldChange}
                      placeholder={t("enter_current_password")}
                      className={errors.currentPassword ? styles.error : ""}
                      required
                    />
                    <span className={styles.passwordToggle} onClick={() => togglePasswordVisibility("currentPassword")}>
                      {showPasswords.currentPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {errors.currentPassword && <span className={styles.fieldError}>{errors.currentPassword}</span>}
                </div>

                <div className={styles.passwordField}>
                  <label>{t("new_password")}</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showPasswords.password ? "text" : "password"}
                      name="password"
                      value={passwordData.password}
                      onChange={handlePasswordFieldChange}
                      placeholder={t("enter_new_password")}
                      className={errors.password ? styles.error : ""}
                      required
                    />
                    <span className={styles.passwordToggle} onClick={() => togglePasswordVisibility("password")}>
                      {showPasswords.password ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
                </div>

                <div className={styles.passwordField}>
                  <label>{t("confirm_new_password")}</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showPasswords.passwordConfirmation ? "text" : "password"}
                      name="passwordConfirmation"
                      value={passwordData.passwordConfirmation}
                      onChange={handlePasswordFieldChange}
                      placeholder={t("reenter_new_password")}
                      className={errors.passwordConfirmation ? styles.error : ""}
                      required
                    />
                    <span className={styles.passwordToggle} onClick={() => togglePasswordVisibility("passwordConfirmation")}>
                      {showPasswords.passwordConfirmation ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {errors.passwordConfirmation && <span className={styles.fieldError}>{errors.passwordConfirmation}</span>}
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowPasswordModal(false);
                    setErrors({});
                  }}
                >
                  {t("cancel")}
                </button>
                <button type="submit" className={styles.submitPasswordBtn} disabled={saving}>
                  {saving ? t("saving") : t("change_password")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.logoutModalContent}>
            <button className={styles.closeBtn} onClick={() => setShowLogoutModal(false)}>
              <FaTimes />
            </button>
            <h3 className={styles.modalTitle}>{t("logout_confirmation")}</h3>
            <div className={styles.modalActions}>
              <button type="button" className={styles.confirmLogoutBtn} onClick={handleLogout}>
                {t("logout_yes")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
