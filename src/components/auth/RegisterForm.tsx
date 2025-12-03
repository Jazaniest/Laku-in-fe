
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = () => {
        if (formData.password !== formData.confirmPassword) {
            alert('Password tidak cocok!');
            return;
        }
    
        console.log('Register data:', formData);
        // Handle register logic here
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
        {/* Full Name Field */}
        <div className="space-y-2">
          <Label htmlFor="register-name">Nama Lengkap</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              id="register-name"
              name="fullName"
              type="text"
              placeholder="Masukkan nama lengkap"
              className="pl-10"
              value={formData.fullName}
              onChange={handleChange}
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
            />
          </div>
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="register-phone">Nomor Telepon</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              id="register-phone"
              name="phone"
              type="tel"
              placeholder="08xxxxxxxxxx"
              className="pl-10"
              value={formData.phone}
              onChange={handleChange}
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

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="register-confirm-password">Konfirmasi Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              id="register-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Ulangi password"
              className="pl-10 pr-10"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full" size="lg">
          Daftar Sekarang
        </Button>
      </div>
    </CardContent>
  );
};

export default RegisterForm;