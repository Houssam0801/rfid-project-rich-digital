import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic will go here
  };

  return (
    <div className="relative h-[calc(100vh-4.06rem)] w-full overflow-hidden">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-[url('/images/parking2.png')] bg-cover bg-center bg-no-repeat"
      >
        {/* Dark overlay with blur effect */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      </div>

      {/* Login Card Container */}
      <div className="relative z-10 h-full w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 shadow-3xl">
        <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-card rounded-lg shadow-xl p-8 space-y-6">
          {/* Logo & Title */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <img 
                src="/images/logo_RFID2.png" 
                alt="RFID SmartTrace Plus" 
                className="h-15 w-50 rounded-xl "
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground">
              SmartPulse Richbond
            </h2>
            <p className="text-sm text-gray-600 dark:text-muted-foreground">
              Connexion à votre compte
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-base font-medium text-gray-700 dark:text-foreground"
              >
                Votre email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="operateur@richbond.ma"
                className="h-11 bg-white dark:bg-input border-gray-300 dark:border-border text-gray-900 dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-base font-medium text-gray-700 dark:text-foreground"
              >
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 bg-white dark:bg-input border-gray-300 dark:border-border text-gray-900 dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-[var(--landing-primary)] focus:ring-[var(--landing-primary)]"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-600 dark:text-muted-foreground"
                >
                  Se souvenir de moi
                </label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-[#234367] hover:text-[#234367]/80"
              >
                Mot de passe oublié ?
              </a>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleSubmit}
              className="w-full h-11 bg-[#234367] hover:bg-[#234367]/90 text-white font-medium rounded-md mt-5"
            >
              Se connecter
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-muted-foreground">
              Vous n'avez pas de compte ?{' '}
              <a
                href="#"
                className="font-medium text-[#234367] hover:text-[#234367]/80"
              >
                Créer un compte
              </a>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}