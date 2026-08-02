import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './dashboard.css';

const Settings = () => {
  const userId = localStorage.getItem("userId");
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    company: '',
    website: ''
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/userProfile/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user profile');
      const data = await res.json();
      return data.user;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.userName || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        company: user.company || '',
        website: user.website || ''
      });
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await fetch(`http://localhost:5000/updateUserProfile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      alert('Profile updated successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="dashboard-content-area skeleton" style={{ height: '400px' }}></div>;
  }

  return (
    <div className="dashboard-content-area">
      <div className="content-header">
        <h2>Settings</h2>
      </div>

      <div className="settings-form-container">
        <h3>Public Profile</h3>
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Public Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows="4"></textarea>
            <small>You can @mention other users and organizations to link to them.</small>
          </div>

          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input type="text" id="website" name="website" value={formData.website} onChange={handleChange} />
          </div>

          <button type="submit" className="primary-btn" disabled={mutation.isPending}>
            {mutation.isPending ? 'Updating...' : 'Update profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
