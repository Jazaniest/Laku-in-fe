
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import type { RegisterRequest } from '@/types/auth.types';

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<RegisterRequest>({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = async () => {
        setIsLoading(true);
        
        try {
            const response = await authService.register(formData);
            
            if (response.success) {
                alert('Registrasi berhasil! Anda akan dialihkan ke halaman login.');
                // Reset form
                setFormData({ name: '', email: '', password: '' });
                // You might want to redirect to login or auto-login here
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(`Registrasi gagal: ${error.message}`);
            } else {
                alert('Registrasi gagal. Silakan coba lagi.');
            }
        } finally {
            setIsLoading(false);
        }
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
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="register-name">Nama Lengkap</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              id="register-name"
              name="name"
              type="text"
              placeholder="Masukkan nama lengkap"
              className="pl-10"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              id="register-email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              className="pl-10"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              id="register-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimal 8 karakter"
              className="pl-10 pr-10"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
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

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit} 
          className="w-full" 
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
        </Button>
      </div>
    </CardContent>
  );
};

export default RegisterForm;