import React, { useEffect, useState, createContext } from 'react';
import { toast } from 'react-toastify';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [colorSelectFormData, setColorSelectFormData] = useState(() => {
        const savedColors = localStorage.getItem('themeColors');
        return savedColors
        ? JSON.parse(savedColors)
        : {
            primaryColor: '#000000',
            secondaryColor: '#ffffff',
            accentColor: '#fccf03',
            colorInputMode: 'pallete'
            };
    });

    const [isLoadingStoreSettings, setIsLoadingStoreSettings] = useState(true);

    useEffect(() => {
        const fetchStoreSettings = async () => {
        try {
            setIsLoadingStoreSettings(true);
            const response = await fetch('http://localhost:8081/api/settings');
            const data = await response.json();

            if (response.ok) {
            setColorSelectFormData((prev) => ({
                ...prev,
                primaryColor: data.primaryColor || prev.primaryColor,
                secondaryColor: data.secondaryColor || prev.secondaryColor,
                accentColor: data.accentColor || prev.accentColor,
            }));
            } else {
            toast('Error al cargar configuraciones', {
                position: 'top-right',
                autoClose: 2000,
                theme: 'dark',
                className: 'custom-toast',
            });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingStoreSettings(false);
        }
        };

        fetchStoreSettings();
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', colorSelectFormData.primaryColor);
        root.style.setProperty('--secondary-color', colorSelectFormData.secondaryColor);
        root.style.setProperty('--accent-color', colorSelectFormData.accentColor);
    }, [colorSelectFormData]);

    useEffect(() => {
        localStorage.setItem('themeColors', JSON.stringify(colorSelectFormData));
    }, [colorSelectFormData]);

    return (
        <ThemeContext.Provider value={{ colorSelectFormData, setColorSelectFormData }}>
        {children}
        </ThemeContext.Provider>
    );
};
