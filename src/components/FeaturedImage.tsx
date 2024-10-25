const FeaturedImage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-purple-400 mb-4">{t('featuredImage')}</h2>
            {/* ... 图片内容 ... */}
        </div>
    );
};