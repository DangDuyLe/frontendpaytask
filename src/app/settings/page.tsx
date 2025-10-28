'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useRouter } from "next/navigation";
import { User, Lock, Bell, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

export default function Settings() {
  const router = useRouter();
  const { toast } = useToast();
  
  // Profile state
  const [name, setName] = useState("Sarah Chen");
  const [bio, setBio] = useState("Experienced micro-task worker");
  const [location, setLocation] = useState("San Francisco, CA");
  const [skills, setSkills] = useState(["Data Entry", "Photography", "Translation"]);
  const [newSkill, setNewSkill] = useState("");
  const [languages, setLanguages] = useState(["English", "Mandarin"]);
  const [newLanguage, setNewLanguage] = useState("");
  
  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Notification state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskAlerts, setTaskAlerts] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [reviewNotifications, setReviewNotifications] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);

  const handleProfileSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Password changed",
      description: "Your password has been successfully updated.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleNotificationsSave = () => {
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addLanguage = () => {
    if (newLanguage && !languages.includes(newLanguage)) {
      setLanguages([...languages, newLanguage]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (language: string) => {
    setLanguages(languages.filter(l => l !== language));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security</p>
        </div>
      </div>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
              <TabsTrigger value="profile" className="data-[state=active]:bg-[#20A277] data-[state=active]:text-white">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-[#20A277] data-[state=active]:text-white">
                <Lock className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-[#20A277] data-[state=active]:text-white">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  <p className="text-sm text-gray-600 mt-1">Update your profile details and preferences</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-900">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-gray-900">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-gray-900">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                  <p className="text-sm text-gray-600 mt-1">Add skills that match task requirements</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} className="bg-gray-100 text-gray-700 pr-1">
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                    />
                    <Button onClick={addSkill} className="bg-[#20A277] hover:bg-[#1a8d66] text-white">Add</Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Languages</h2>
                  <p className="text-sm text-gray-600 mt-1">Languages you can work in</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {languages.map((language) => (
                      <Badge key={language} className="bg-gray-100 text-gray-700 pr-1">
                        {language}
                        <button
                          onClick={() => removeLanguage(language)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a language"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                      className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                    />
                    <Button onClick={addLanguage} className="bg-[#20A277] hover:bg-[#1a8d66] text-white">Add</Button>
                  </div>
                </div>
              </div>

              <Button onClick={handleProfileSave} className="w-full bg-[#20A277] hover:bg-[#1a8d66] text-white">
                Save Profile Changes
              </Button>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                  <p className="text-sm text-gray-600 mt-1">Update your password regularly for security</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-sm font-medium text-gray-900">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-sm font-medium text-gray-900">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-900">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handlePasswordChange} className="w-full bg-[#20A277] hover:bg-[#1a8d66] text-white">
                Update Security Settings
              </Button>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                  <p className="text-sm text-gray-600 mt-1">Choose how you want to be notified</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium text-gray-900">Email Notifications</Label>
                      <div className="text-sm text-gray-600">
                        Receive notifications via email
                      </div>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium text-gray-900">Task Alerts</Label>
                      <div className="text-sm text-gray-600">
                        New tasks matching your skills
                      </div>
                    </div>
                    <Switch
                      checked={taskAlerts}
                      onCheckedChange={setTaskAlerts}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium text-gray-900">Deadline Reminders</Label>
                      <div className="text-sm text-gray-600">
                        Reminders 2 hours before deadline
                      </div>
                    </div>
                    <Switch
                      checked={deadlineReminders}
                      onCheckedChange={setDeadlineReminders}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium text-gray-900">Review Notifications</Label>
                      <div className="text-sm text-gray-600">
                        When your work is reviewed
                      </div>
                    </div>
                    <Switch
                      checked={reviewNotifications}
                      onCheckedChange={setReviewNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium text-gray-900">Payment Notifications</Label>
                      <div className="text-sm text-gray-600">
                        When you receive payments
                      </div>
                    </div>
                    <Switch
                      checked={paymentNotifications}
                      onCheckedChange={setPaymentNotifications}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleNotificationsSave} className="w-full bg-[#20A277] hover:bg-[#1a8d66] text-white">
                Save Notification Preferences
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};



