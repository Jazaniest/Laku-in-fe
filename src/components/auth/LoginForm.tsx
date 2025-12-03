import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = () => {
    console.log('Login data:', formData);
    // Handle login logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <CardContent className="space-y-4">
        <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                id="login-email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                className="pl-10"
                value={formData.email}
                onChange={handleChange}
                />
            </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                className="pl-10 pr-10"
                value={formData.password}
                onChange={handleChange}
                />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                >
                {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                ) : (
                    <Eye className="h-4 w-4" />
                )}
                </button>
            </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
            <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline">
                Lupa password?
            </a>
            </div>

            {/* Submit Button */}
            <Button onClick={handleSubmit} className="w-full" size="lg">
            Masuk
            </Button>
        </div>
    </CardContent>
  );
};

export default LoginForm;