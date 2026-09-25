import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { AuthUser } from '@/services/authService';

interface UserAvatarProps {
  size?: number;
  className?: string;
  withLink?: boolean;
  onClick?: () => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  size = 34,
  className = '',
  withLink = true,
  onClick,
}) => {
  const profile = useStore((state) => state.profile);
  const [imgError, setImgError] = useState(false);

  const authUser = useMemo<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('fitcubes_auth_user');
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  }, []);

  const avatarUrl = profile.avatarUrl || authUser?.avatarUrl;
  const displayName = profile.name || authUser?.name || authUser?.email || '';
  const initial = displayName.trim().charAt(0).toUpperCase();

  const handleImageError = () => {
    setImgError(true);
  };

  const renderContent = () => {
    if (avatarUrl && !imgError) {
      return (
        <img
          src={avatarUrl}
          alt={displayName || 'User Avatar'}
          onError={handleImageError}
          className="h-full w-full object-cover"
        />
      );
    }

    if (initial) {
      return (
        <span
          className="font-semibold text-[#F59F0A] select-none leading-none"
          style={{ fontSize: `${Math.round(size * 0.42)}px` }}
        >
          {initial}
        </span>
      );
    }

    return (
      <User
        className="text-[#B6B6BC]"
        style={{ width: `${Math.round(size * 0.5)}px`, height: `${Math.round(size * 0.5)}px` }}
        strokeWidth={1.75}
      />
    );
  };

  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const baseClasses = `relative flex shrink-0 items-center justify-center rounded-full border border-[#4F3911] bg-[#16181D] overflow-hidden transition-all duration-200 hover:border-[#F59F0A] hover:shadow-[0_0_8px_rgba(245,159,10,0.25)] ${className}`;

  if (withLink) {
    return (
      <Link
        to="/profile"
        onClick={onClick}
        style={containerStyle}
        className={baseClasses}
        aria-label="Open User Profile"
        title={displayName || 'User Profile'}
      >
        {renderContent()}
      </Link>
    );
  }

  return (
    <div
      style={containerStyle}
      className={baseClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      title={displayName || 'User Profile'}
    >
      {renderContent()}
    </div>
  );
};
