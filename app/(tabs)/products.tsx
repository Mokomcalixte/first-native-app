import { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Text, Card } from '@rneui/themed';
import CachedImage from 'expo-cached-image';

interface Product {
  title: string;
  description: string;
  images: string[];
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  const getProducts = useCallback(async () => {
    try {
      const products = await axios.get('https://api.escuelajs.co/api/v1/products');
      setProducts(products.data as Product[]);
    } catch (error) {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <View style={styles.container}>
      <ThemedText type="title" darkColor="black">
        Products
      </ThemedText>
      <ScrollView>
        {products.map((product, index) => (
          <Card key={index}>
            <Card.Title>{product.title}</Card.Title>
            <Card.Divider />
            <View style={{ position: "relative", alignItems: "center" }}>
              <CachedImage
                style={{ width: "100%", height: 100 }}
                resizeMode="contain"
                source={{ uri: product.images[0] }}
                cacheKey={`product-image-${index}`}
              />
              <Text>{product.description}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 80,
    marginHorizontal: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
