
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email, phone, notes);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-3">
        <div>
          <div className="text-sm font-medium text-gray-500">Name</div>
          <div>{profile.name || 'Not set'}</div>
        </div>
        
        {profile.email && (
          <div>
            <div className="text-sm font-medium text-gray-500">Email</div>
            <div>{profile.email}</div>
          </div>
        )}
        
        {profile.phone && (
          <div>
            <div className="text-sm font-medium text-gray-500">Phone</div>
            <div>{profile.phone}</div>
          </div>
        )}
        
        {profile.notes && (
          <div>
            <div className="text-sm font-medium text-gray-500">Notes</div>
            <div className="text-sm">{profile.notes}</div>
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email (Optional)</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (Optional)</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special notes?"
        />
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" size="sm">Save</Button>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProfileSection;
