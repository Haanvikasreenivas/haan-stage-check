
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from 'lucide-react';

interface ProfileSectionProps {
  profile: {
    name: string;
    email?: string;
    phone?: string;
    notes?: string;
  };
  onSubmit: (name: string, email?: string, phone?: string, notes?: string) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, onSubmit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [notes, setNotes] = useState(profile.notes || '');

  const handleSubmit = useCallback(() => {
    onSubmit(name, email, phone, notes);
    setIsEditing(false);
  }, [name, email, phone, notes, onSubmit]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{name || 'No Name'}</h3>
          <p className="text-sm text-gray-500">{email || 'No Email'}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      {isEditing ? (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">Save</Button>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileSection;
