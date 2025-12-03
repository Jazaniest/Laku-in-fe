import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'; // <-- Import Link disini

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-zinc-900" />
                    <span className="font-bold text-xl text-zinc-900">Laku-In</span>
                </div>

                <Button asChild>
                    <Link to="/auth">Login</Link>
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;