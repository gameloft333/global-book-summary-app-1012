import React, { useState, useEffect } from 'react';
import { quoteBankBilingual } from '../data/quoteBankBilingual';
import { useTranslation } from 'react-i18next';

interface Quote {
    content: string;
    author: string;
    work: string;
}

const RandomQuote: React.FC = () => {
    const [quote, setQuote] = useState<Quote | null>(null);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const quotes = i18n.language.startsWith('zh') ? quoteBankBilingual.zh : quoteBankBilingual.en;
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    }, [i18n.language]); // 当语言改变时重新获取格言

    if (!quote) return null;

    return (
        <div className="mt-8">
            <div className="p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl backdrop-blur-sm shadow-xl">
                <blockquote className="relative">
                    <div className="absolute -top-4 -left-4 text-4xl text-purple-400 opacity-50">"</div>
                    <p className="text-gray-200 text-lg font-serif italic leading-relaxed mb-4 pl-6">
                        {quote.content}
                    </p>
                    <footer className="text-right">
                        <span className="text-purple-400">—— {quote.author}</span>
                        <span className="ml-2 text-gray-400">《{quote.work}》</span>
                    </footer>
                </blockquote>
            </div>
        </div>
    );
};

export default RandomQuote;
