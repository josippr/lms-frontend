import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateProfile, fetchProfile } from "@/service/apiService";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setProfile } from "@/redux/actions/profile"; // adjust path as needed

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile); // adjust slice name if different
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [applyImmediately, setApplyImmediately] = useState(false);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await fetchProfile(token);
      dispatch(setProfile(data));
    } catch (err) {
      console.error("Failed to fetch profile", err);
      toast.error("Failed to load profile", {
        style: { backgroundColor: "#dc2626", color: "white" },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (field, value) => {
    dispatch(setProfile({ ...profile, [field]: value }));
  };

  const handleNotifChange = (field, value) => {
    dispatch(
      setProfile({
        ...profile,
        notificationPreferences: {
          ...profile.notificationPreferences,
          [field]: value,
        },
      })
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const { _id, ...profileData } = profile;

      await updateProfile(token, profileData);
      toast.success("Profile updated successfully!", {
        style: { backgroundColor: "#16a34a", color: "white" },
      });

      if (applyImmediately) {
        await loadProfile();
        toast.info("Changes applied immediately", {
          style: { backgroundColor: "#0284c7", color: "white" },
        });
      }
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to update profile", {
        description: err.message,
        style: { backgroundColor: "#dc2626", color: "white" },
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading profile...</div>;
  if (!profile) return <div className="p-4 text-red-500">Profile not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Toaster />
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profile.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled
            />
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="language">Language</Label>
            <Select
              value={profile.language}
              onValueChange={(value) => handleChange("language", value)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hr">Croatian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="darkMode">Set default theme to Dark</Label>
            <Switch
              id="darkMode"
              checked={profile.darkMode}
              onCheckedChange={(val) => handleChange("darkMode", val)}
            />
          </div>

          {/* <Separator /> */}

          {/* <div>
            <h3 className="text-sm font-semibold mb-2">Notification Preferences</h3>
            <div className="space-y-2">
              {["email", "sms", "push"].map((method) => (
                <div className="flex items-center justify-between" key={method}>
                  <Label className="capitalize">{method}</Label>
                  <Switch
                    checked={profile.notificationPreferences?.[method] || false}
                    onCheckedChange={(val) => handleNotifChange(method, val)}
                  />
                </div>
              ))}
            </div>
          </div> */}

          <Separator />

          {/* <div className="flex items-center justify-between">
            <Label htmlFor="applyImmediately">Apply Changes Immediately</Label>
            <Switch
              id="applyImmediately"
              checked={applyImmediately}
              onCheckedChange={setApplyImmediately}
            />
          </div> */}

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-[180px] hover:cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
