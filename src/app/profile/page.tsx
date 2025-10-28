'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Star, Award, MapPin, Calendar, TrendingUp, CheckCircle, Edit, X } from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";

export default function Profile() {
  const router = useRouter();
  const userId = "1"; // Would come from URL params in real app
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    location: "",
    bio: "",
    skills: [] as string[],
    languages: [] as string[],
    availability: "",
    skillInput: "",
    languageInput: "",
  });

  // Mock data
  const [profile, setProfile] = useState({
    id: userId || "1",
    name: "Sarah Chen",
    role: "worker",
    avatar: "/placeholder.svg",
    reputation: 4.9,
    joinedDate: "2024-03-15",
    location: "San Francisco, CA",
    completedTasks: 247,
    totalEarned: 3240,
    successRate: 98,
    averageCompletionTime: "2.5 hours",
    skills: [
      "Data Entry",
      "Photography",
      "Translation",
      "Research",
      "Content Moderation",
      "Surveys"
    ],
    languages: ["English", "Mandarin", "Spanish"],
    availability: "Full-time",
    bio: "Experienced micro-task worker specializing in data verification and content moderation. Detail-oriented with a track record of high-quality submissions and early completions.",
    recentReviews: [
      {
        id: 1,
        clientName: "TechData Corp",
        rating: 5,
        comment: "Excellent work! Completed ahead of schedule with perfect accuracy.",
        date: "2025-10-20"
      },
      {
        id: 2,
        clientName: "MarketResearch Inc",
        rating: 5,
        comment: "Very thorough and professional. Will hire again.",
        date: "2025-10-15"
      },
      {
        id: 3,
        clientName: "Global Content Ltd",
        rating: 4,
        comment: "Good work overall. Minor revisions needed but quick turnaround.",
        date: "2025-10-10"
      }
    ],
    achievements: [
      { name: "Early Bird", description: "50+ tasks submitted before deadline", icon: "🏆" },
      { name: "Accuracy Master", description: "99% approval rate", icon: "🎯" },
      { name: "Speed Demon", description: "Average 50% faster than deadline", icon: "⚡" },
      { name: "Top Contributor", description: "Top 5% of all workers", icon: "⭐" }
    ]
  });

  const handleEditClick = () => {
    setEditedProfile({
      name: profile.name,
      location: profile.location,
      bio: profile.bio,
      skills: [...profile.skills],
      languages: [...profile.languages],
      availability: profile.availability,
      skillInput: "",
      languageInput: "",
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveProfile = () => {
    setProfile({
      ...profile,
      name: editedProfile.name,
      location: editedProfile.location,
      bio: editedProfile.bio,
      skills: editedProfile.skills,
      languages: editedProfile.languages,
      availability: editedProfile.availability,
    });
    setIsEditDialogOpen(false);
  };

  const addSkill = () => {
    if (editedProfile.skillInput.trim() && !editedProfile.skills.includes(editedProfile.skillInput.trim())) {
      setEditedProfile({
        ...editedProfile,
        skills: [...editedProfile.skills, editedProfile.skillInput.trim()],
        skillInput: "",
      });
    }
  };

  const removeSkill = (skill: string) => {
    setEditedProfile({
      ...editedProfile,
      skills: editedProfile.skills.filter(s => s !== skill),
    });
  };

  const addLanguage = () => {
    if (editedProfile.languageInput.trim() && !editedProfile.languages.includes(editedProfile.languageInput.trim())) {
      setEditedProfile({
        ...editedProfile,
        languages: [...editedProfile.languages, editedProfile.languageInput.trim()],
        languageInput: "",
      });
    }
  };

  const removeLanguage = (language: string) => {
    setEditedProfile({
      ...editedProfile,
      languages: editedProfile.languages.filter(l => l !== language),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-2xl">{profile.name[0]}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
                  <Badge className="mb-4">{profile.role}</Badge>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Star className="h-5 w-5 fill-accent text-accent" />
                    <span className="text-xl font-bold">{profile.reputation}</span>
                    <span className="text-muted-foreground text-sm">({profile.completedTasks} reviews)</span>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(profile.joinedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tasks Completed</span>
                  <span className="font-bold">{profile.completedTasks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="font-bold text-accent">{profile.successRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Earned</span>
                  <span className="font-bold">${profile.totalEarned}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Completion</span>
                  <span className="font-bold">{profile.averageCompletionTime}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{profile.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills & Languages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((lang) => (
                      <Badge key={lang} variant="secondary">{lang}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Availability</h4>
                  <Badge>{profile.availability}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {profile.achievements.map((achievement) => (
                    <div key={achievement.name} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <div className="font-semibold">{achievement.name}</div>
                        <div className="text-xs text-muted-foreground">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews ({profile.recentReviews.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.recentReviews.map((review) => (
                  <div key={review.id}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold">{review.clientName}</div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                    {review.id !== profile.recentReviews[profile.recentReviews.length - 1].id && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Update your profile information. Changes will be saved when you click Save.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editedProfile.location}
                onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                value={editedProfile.availability}
                onChange={(e) => setEditedProfile({ ...editedProfile, availability: e.target.value })}
                placeholder="e.g., Full-time, Part-time, Weekends"
              />
            </div>

            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={editedProfile.skillInput}
                  onChange={(e) => setEditedProfile({ ...editedProfile, skillInput: e.target.value })}
                  placeholder="Add a skill"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button type="button" onClick={addSkill} variant="secondary">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {editedProfile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Languages</Label>
              <div className="flex gap-2">
                <Input
                  value={editedProfile.languageInput}
                  onChange={(e) => setEditedProfile({ ...editedProfile, languageInput: e.target.value })}
                  placeholder="Add a language"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addLanguage();
                    }
                  }}
                />
                <Button type="button" onClick={addLanguage} variant="secondary">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {editedProfile.languages.map((language) => (
                  <Badge key={language} variant="secondary" className="gap-1">
                    {language}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeLanguage(language)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveProfile}>Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};




