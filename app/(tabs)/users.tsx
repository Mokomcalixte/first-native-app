import { View, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Text, Card } from '@rneui/themed';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
 
interface User {
  name: string;
  email: string;
  avatar: string;
}
 
export default function Users() {
 
  const [users, setUsers] = useState<User[]>([]);
 
  const getUsers = useCallback(async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.escuelajs.co/api/v1/users',
      });
 
      setUsers(response.data as User[]);
    } catch (error) {
      setUsers([]);
    }
  }, []);
 
  useEffect(() => {
    getUsers();
  }, [getUsers]);
 
  return (
    <View style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Users</ThemedText>
      </ThemedView>
      <ScrollView>
        {
          users.map((user: User, index) => (
            <Card containerStyle={styles.card} key={index}>
              <Card.Title>{user.name}</Card.Title>
              <Card.Divider />
              <View style={{ position: "relative", alignItems: "center" }}>
                <Image
                  style={{ width: "100%", height: 100 }}
                  resizeMode="contain"
                  source={{
                    uri: user.avatar,
                  }}
                />
                <Text style={{ color: 'green', padding: 10 }}>{user.email}</Text>
              </View>
            </Card>
          ))
        }
      </ScrollView>
    </View>
  );
}
 
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'black'
  },
  container: {
    marginTop: 35,
  },
  card: {
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 5,
  }
});