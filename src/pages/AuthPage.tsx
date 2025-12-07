import { ShoppingBag } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1 sm:gap-2 bg-zinc-900 text-white px-3 sm:px-4 py-2 rounded-full mb-3 sm:mb-4">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold text-sm sm:text-lg">Laku-In</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">Selamat Datang!</h1>
          <p className="text-zinc-600 mt-1 text-sm sm:text-base">Masuk atau daftar untuk melanjutkan</p>
        </div>

        {/* Auth Card with Tabs */}
        <Card className="shadow-lg sm:shadow-xl">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2 px-2">
                <TabsTrigger value="login" className="text-sm sm:text-base">Login</TabsTrigger>
                <TabsTrigger value="register" className="text-sm sm:text-base">Register</TabsTrigger>
              </TabsList>
            </CardHeader>

            {/* Login Tab */}
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-zinc-600 mt-4 sm:mt-6 leading-relaxed">
          Dengan melanjutkan, Anda menyetujui{' '}
          <a href="#" className="text-zinc-900 font-medium hover:underline">
            Syarat & Ketentuan
          </a>{' '}
          dan{' '}
          <a href="#" className="text-zinc-900 font-medium hover:underline">
            Kebijakan Privasi
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;