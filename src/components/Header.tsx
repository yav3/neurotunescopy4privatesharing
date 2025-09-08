import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import { useAuthContext } from "@/components/auth/AuthProvider";

export const Header = () => {
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuthContext();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="px-4 py-4 md:px-8 border-b">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-center flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">NeuroTunes</h1>
          <p className="text-sm text-muted-foreground">please select your therapeutic goal</p>
        </div>
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profile?.avatar_url || ''} alt="Profile" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              {(userRole === 'admin' || userRole === 'super_admin') && (
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};