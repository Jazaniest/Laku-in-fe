import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/types/validation.types';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Setup form dengan react-hook-form dan zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      clearErrors();
      
      const response = await authService.login({
        email: data.email.toLowerCase().trim(),
        password: data.password
      });

      if (response.success) {
        console.log('Login successful:', response);
        navigate('/dashboard');
      } else {
        // Handle specific auth errors
        if (response.message?.includes('email')) {
          setError('email', { type: 'manual', message: 'Email tidak terdaftar' });
        } else if (response.message?.includes('password')) {
          setError('password', { type: 'manual', message: 'Password salah' });
        } else {
          setError('password', { type: 'manual', message: response.message || 'Login gagal' });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        if (error.message.includes('Network') || error.message.includes('network')) {
          setError('password', { type: 'manual', message: 'Koneksi internet bermasalah. Periksa koneksi Anda.' });
        } else if (error.message.includes('timeout')) {
          setError('password', { type: 'manual', message: 'Request timeout. Silakan coba lagi.' });
        } else {
          setError('password', { type: 'manual', message: 'Email atau password salah' });
        }
      } else {
        setError('password', { type: 'manual', message: 'Terjadi kesalahan saat login' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline">
            Lupa password?
          </a>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? 'Memproses...' : 'Masuk'}
        </Button>
      </form>
    </CardContent>
  );
};

export default LoginForm;