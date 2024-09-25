import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FC } from "react";
import { FaFacebookF, FaGoogle, FaSpotify } from 'react-icons/fa';

const LoginPage: FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <div className="flex bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Logo */}
        <div className="flex flex-col justify-center items-center w-1/2">
          <h1 className="text-4xl font-bold mb-4">MusicBox</h1>
          <div className="text-purple-500 text-8xl">
            Logo
          </div>
        </div>

        {/* Login form */}
        <div className="w-1/2 px-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-500">INICIAR SESIÓN</h2>

          <form>
            <div className="mb-4">
              <Label htmlFor="email" className="text-sm sm:text-base text-white">Email</Label>
              <Input
                id="email"
                type="email"
                required
                className="w-full bg-gray-700 text-white border-gray-600 focus:border-purple-500 text-sm sm:text-base"
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="password" className="text-sm sm:text-base text-white">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="w-full bg-gray-700 text-white border-gray-600 focus:border-purple-500 text-sm sm:text-base"
              />
              <a href="#" className="text-xs text-blue-400 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base py-2 sm:py-3">
              INGRESAR
            </Button>

            {/* Social login */}
            <div className="flex items-center justify-center space-x-4 mt-6">
              <Button variant="outline" className="bg-red-600 p-2 rounded-2xl"><FaGoogle /></Button>
              <Button variant="outline" className="bg-blue-600 p-2 rounded-2xl"><FaFacebookF /></Button >
              <Button variant="outline" className="bg-green-500 p-2 rounded-2xl"><FaSpotify /></Button>
            </div>

            <p className="text-sm mt-4">
              ¿Aún no tienes una cuenta?{" "}
              <a href="#" className="text-blue-400 hover:underline">
                Regístrate Aquí
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginPage