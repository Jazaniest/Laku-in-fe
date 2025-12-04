import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SearchSection = ({
    value,
    onChange,
    onClear,
    placeholder = 'Cari transaksi...'
}: {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
    placeholder?: string;
}) => {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
                placeholder={placeholder}
                className="pl-10 pr-10 w-full sm:w-64"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    onClick={onClear}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};

export default SearchSection;
