import {View, Text, StyleSheet} from 'react-native'

export function Pessoas({data}) {
  const {idade, frase, nome} =data
  return (
    <View style={styles.areaPessoa}>
      <Text style={styles.textoPessoa}>Nome: {nome}</Text>
      <Text style={styles.textoPessoa}>Idade: {idade}</Text>
      <Text style={styles.textoPessoa}>Frase: {frase}</Text>
    </View>
  )
}

const styles =  StyleSheet.create({
  areaPessoa: {
    backgroundColor: '#222',
    height: 200, 
    marginBottom: 15
  },
  textoPessoa: {
    color: '#fff',
    fontSize: 20,
  }
})