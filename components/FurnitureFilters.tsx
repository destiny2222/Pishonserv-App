import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { getFurnitureCategories, FurnitureCategory } from '@/libs/endpoints/furniture';

import { router, useLocalSearchParams } from 'expo-router';

const FurnitureFilters = () => {
    const params = useLocalSearchParams < { category?: string } > ();
    const [selectedCategory, setSelectedCategory] = useState(params.category || 'All');
    const [categories, setCategories] = useState < Array < { label: string; value: string; count?: number } >> ([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getFurnitureCategories();
                const items = response.data.items;

                if (!Array.isArray(items)) {
                    setCategories([{ label: 'All', value: 'All' }]);
                    return;
                }

                const formattedCategories = items.map((cat: FurnitureCategory) => {
                    let label = cat.category_path;
                    if (label.includes('>')) {
                        label = label.split('>').pop()?.trim() || label;
                    } else if (label.includes(',')) {
                        label = label.split(',').pop()?.trim() || label;
                    }

                    return {
                        label: label,
                        value: cat.category_path,
                        count: cat.product_count
                    };
                });

                setCategories([{ label: 'All', value: 'All' }, ...formattedCategories]);
            } catch (error) {

                setCategories([{ label: 'All', value: 'All' }]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (params.category) {
            setSelectedCategory(params.category);
        } else {
            setSelectedCategory('All');
        }
    }, [params.category]);

    const handleCategory = (category: string) => {
        if (category === 'All' || selectedCategory === category) {
            setSelectedCategory('All');
            router.setParams({ category: undefined as any });
            return;
        }
        setSelectedCategory(category);
        router.setParams({ category });
    };

    if (loading) {
        return (
            <View className="mt-3 mb-2 px-4 h-10 justify-center">
                <ActivityIndicator size="small" color="#C9A24D" />
            </View>
        );
    }

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 mb-2 px-4">
            {categories.map((item) => {
                if (!item) return null;
                const isSelected = selectedCategory === item.value;
                
                return (
                    <TouchableOpacity
                        key={item.value || item.label}
                        onPress={() => handleCategory(item.value)}
                        className="mr-3 px-6 py-2 rounded-full border"
                        style={{
                            backgroundColor: isSelected ? "#C9A24D" : "#FFFFFF",
                            borderColor: isSelected ? "#C9A24D" : "#E5E7EB",
                        }}
                    >
                        <Text 
                            className="font-poppins-medium text-sm"
                            style={{ color: isSelected ? "#FFFFFF" : "#4B5563" }}
                        >
                            {item.label} {item.count !== undefined ? `(${item.count})` : ''}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

export default FurnitureFilters;
