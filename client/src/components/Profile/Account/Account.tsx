import PersonalInformations from "./PersonalInformations";
import AccountSettings from "./AccountSettings";
import ChangePassword from "./ChangePassword";
import DangerZone from "./DangerZone";
import type { AccountProps } from "@/types/profileType";

const Account = ({
  userData,
  formData,
  handleInputChange,
  handleLogout,
}: AccountProps) => {
  return (
    <div className="space-y-8">
      {/* Personal Information Section */}
      <PersonalInformations
        formData={formData}
        handleInputChange={handleInputChange}
        userData={userData}
      />

      {/* Account Settings Section */}
      <AccountSettings userData={userData} />

      {/* Change Password Section */}
      <ChangePassword userData={userData} />

      {/* Danger Zone Section */}
      <DangerZone handleLogout={handleLogout} />
    </div>
  );
};

export default Account;
