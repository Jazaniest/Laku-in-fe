import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'; // <-- Import Link disini

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200">
            <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 sm:w-6 sm:h-6 text-zinc-900" />
                        <span className="font-bold text-lg sm:text-xl text-zinc-900 hidden sm:inline">Laku-In</span>
                    </div>

                    <Button size="sm" asChild>
                        <Link to="/auth">Login</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;