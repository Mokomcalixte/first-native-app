
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'YOUR_API_URL_HERE';

// AuthService.ts
export const signIn = async (email: string, password: string) => {
  try {
    const response = await axios.post('https://api.escuelajs.co/api/v1/auth/login', {
      email,
      password,
    });

    if (response.status === 201) {
      const token = response.data.access_token;
      // Sauvegarde du token
      localStorage.setItem('token', token);

      console.log('Connexion réussie');
      return token;
    } else {
      throw new Error('Erreur de connexion');
    }
  } catch (error) {
    console.error('Erreur dans signIn:', error);
    throw new Error('Identifiants incorrects');
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem('userToken');
  await AsyncStorage.removeItem('userName');
};
