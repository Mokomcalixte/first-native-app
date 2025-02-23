import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Text, Card, Button, Input } from '@rneui/themed';
import Modal from 'react-native-modal';
import axios from 'axios';
import CachedImage from 'expo-cached-image';

interface User {
  id?: number;
  name: string;
  email: string;
  avatar?: string;
  password?: string;
}

export default function Users() {

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    name: '',
    email: '',
    avatar: '',
    password: ''
  });

  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get('https://api.escuelajs.co/api/v1/users');
      setUsers(response.data as User[]);
      setFilteredUsers(response.data as User[]);
    } catch (error) {
      setUsers([]);
    }
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()) ||
        user.email.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill in all required fields');
      return;
    }

    const userToCreate = {
      ...newUser,
      avatar: newUser.avatar ? newUser.avatar : 'random.com',
    };

    try {
      await axios.post('https://api.escuelajs.co/api/v1/users', userToCreate);
      alert('User created successfully');
      getUsers();
      setNewUser({ name: '', email: '', avatar: '', password: '' });
      toggleModal();
    } catch (error) {
      alert('Failed to create user');
    }
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Users</ThemedText>
        </ThemedView>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={search}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={styles.createButton} onPress={toggleModal}>
            <Text style={styles.createButtonText}>+ Create User</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          {filteredUsers.map((user: User, index) => (
            <Card containerStyle={styles.card} key={index}>
              <Card.Title>{user.name}</Card.Title>
              <Card.Divider />
              <View style={{ position: "relative", alignItems: "center" }}>
                <CachedImage
                  style={{ width: "100%", height: 100 }}
                  source={{ uri: user.avatar }}
                  cacheKey={`user-avatar-${index}`}
                />
                <Text style={{ color: 'green', padding: 10 }}>{user.email}</Text>
              </View>
            </Card>
          ))}
        </ScrollView>

        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create User</Text>
            <Input
              placeholder="Name"
              value={newUser.name}
              onChangeText={text => setNewUser({ ...newUser, name: text })}
            />
            <Input
              placeholder="Email"
              value={newUser.email}
              onChangeText={text => setNewUser({ ...newUser, email: text })}
            />
            <Input
              placeholder="Password"
              secureTextEntry
              value={newUser.password}
              onChangeText={text => setNewUser({ ...newUser, password: text })}
            />
            <Input
              placeholder="Avatar URL (optional)"
              value={newUser.avatar}
              onChangeText={text => setNewUser({ ...newUser, avatar: text })}
            />
            <Button title="Create" onPress={handleCreateUser} />
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 35,
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'black'
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    flex: 1,
    marginRight: 10,
  },
  createButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 5,
  }
});