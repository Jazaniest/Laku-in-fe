import { ShoppingBag } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-full mb-4">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-semibold text-lg">Laku-In</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Selamat Datang!</h1>
          <p className="text-zinc-600 mt-2">Masuk atau daftar untuk melanjutkan</p>
        </div>

        {/* Auth Card with Tabs */}
        <Card className="shadow-xl">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
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
        <p className="text-center text-sm text-zinc-600 mt-6">
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