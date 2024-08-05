import { StatusBar } from 'expo-status-bar';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Pessoas } from './src/Pessoas/Pessoas'
import Constants from 'expo-constants'
import { Picker } from '@react-native-picker/picker';
import {useState} from 'react'

const statusBarHeight = Constants.statusBarHeight;

export default function App() {
  const [food, setFood] = useState(0)

  const dados = [
    {id: '1',frase: 'ola', nome: 'fabio', idade: 21},
    {id:'2', frase: 'Hello', nome: 'João', idade: 19},
    {id: '3',frase: 'Bom dia', nome: 'Samuelson', idade: 40},
    {id: '4',frase: 'Boa noite', nome: 'Baquico', idade: 31},
  ]
  return (
    <View style={styles.container}>
      {/* <FlatList
      data={dados}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => <Pessoas data={item}/> }
      /> */}
        <Text style={styles.logo}>Menu Pizza</Text>
        <Picker
          selectedValue={food}
          onValueChange={ (itemValue, itemIndex) => setFood(itemValue)}
        >
          <Picker.Item key={1} value={1} label="Calabreso" />
          <Picker.Item key={2} value={2} label="Brigadeiro" />
          <Picker.Item key={3} value={3} label="Estragar nois" />
        </Picker>
        <Text style={styles.pizza}>Voce 59,99</Text>
        <Text style={styles.pizza}>R$: 59,99</Text>
        {/* <Text>{food}</Text> */}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: statusBarHeight + 8
    
  },
  logo: {
    textAlign: 'center',
    fontSize: 28
  },
  pizza: {
    marginTop: 15,
    fontSize: 28,
    textAlign: 'center'
  }
});
