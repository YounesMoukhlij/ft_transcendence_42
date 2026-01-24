
import { useTranslation } from '@/contexts/LanguageContext';
import { Calendar } from 'lucide-react';

export function NoMatchHistory() {
    const {t} = useTranslation();
    
    return (
        <tr>
            <td colSpan={5} className="py-16 px-4 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                    <Calendar className="w-12 h-12 text-gray-600" />
                    <p className="text-gray-400 text-base font-medium">{t('profile.noMatchHistory')}</p>
                </div>
            </td>
        </tr>
    );
}
