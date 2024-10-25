import React, { useState, useEffect } from 'react';
import { imagePool } from '../data/imagePool';

const ImageGallery: React.FC = () => {
    const [images, setImages] = useState<typeof imagePool>([]);

    useEffect(() => {
        const randomImages = [...imagePool]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        setImages(randomImages);
    }, []);

    return (
        <div className="grid grid-cols-3 gap-6 my-8">
            {images.map((image, index) => (
                <div key={index} 
                    className="group relative overflow-hidden rounded-xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gray-800"
                >
                    <div className="aspect-w-16 aspect-h-9">
                        <img
                            src={image.url}
                            alt={image.alt}
                            className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <h3 className="text-lg font-medium">{image.alt}</h3>
                                <p className="text-sm text-gray-300">{image.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ImageGallery;
