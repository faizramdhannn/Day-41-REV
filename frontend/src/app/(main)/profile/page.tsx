'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, MapPin, ShoppingBag, LogOut, Edit } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store/auth.store';
import { formatDate } from '@/lib/utils/format';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-gray-500" />
              </div>
              <h2 className="text-xl font-semibold mb-1">{user.nickname}</h2>
              <p className="text-gray-600 text-sm mb-4">{user.email}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/profile/edit')}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Button
              variant="danger"
              fullWidth
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <p className="font-medium">{user.full_name || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <p className="font-medium">{user.phone || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Birthday</label>
                <p className="font-medium">
                  {user.birthday ? formatDate(user.birthday) : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/orders')}
              className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow text-left"
            >
              <ShoppingBag className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">My Orders</h3>
              <p className="text-sm text-gray-600 mt-1">View order history</p>
            </button>

            <button
              onClick={() => router.push('/profile/addresses')}
              className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow text-left"
            >
              <MapPin className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Addresses</h3>
              <p className="text-sm text-gray-600 mt-1">Manage addresses</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
