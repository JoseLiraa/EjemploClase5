import React,{useState,useEffect } from 'react';
import { Text,View, FlatList,TextInput,Button,TouchableHighlight, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import shortid from 'shortid';


export default function App() {
  const [nombre, guardarNombre] = useState('');
  const [carrera, guardarCarrera] = useState('');
  const [edad, guardarEdad] = useState(0);
  const [lista,guardarlista] = useState([]);

  useEffect(() => {
    obtenerDatosStorage();
  }, []);

  const guardarDato = async () => {
    try {
      const datoalumno = { nombre, carrera, edad  };
      datoalumno.id = shortid.generate();
      console.log(datoalumno);
      const listadatos = [...lista, datoalumno]
      guardarlista(listadatos);

      const datos = JSON.stringify(listadatos);
      await AsyncStorage.setItem('listaalumnos', datos);

    } catch (error) {
      console.log(error);
    }
  }

  const obtenerDatosStorage = async () => {
    try {
        const nombreStorage = await AsyncStorage.getItem('listaalumnos');
        if(nombreStorage) {
          const datos = JSON.parse(nombreStorage);
            guardarlista(datos);
            console.log(`esta es la: ${lista}`);
        }

    } catch (error) {
      console.log(error);
    }
  }

  const eliminarDato = async(id) => {
    try {
    const nombresFiltrados = lista.filter( nombre => nombre.id !== id );
    guardarlista( nombresFiltrados );
    const datos = JSON.stringify(nombresFiltrados);
      await AsyncStorage.setItem('listaalumnos', datos);
    obtenerDatosStorage();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
    <View style={styles.encabezado}>
    <Text style={styles.titulo}>Administrador de Alumnos</Text>
    </View>
    <View style={styles.contenedor}>
        <TextInput
            placeholder="Escribe tu nombre"
            style={styles.input}
            onChangeText={ texto => guardarNombre(texto) }
          />

        <TextInput
            placeholder="Escribe su carrera"
            style={styles.input}
            onChangeText={ texto => guardarCarrera(texto) }
          />

        <TextInput
            placeholder="Escribe tu edad"
            style={styles.input}
            onChangeText={ texto => guardarEdad(texto) }
          />
        <View style={estilo.boton}>
          <Button 
              title="Guardar"
              color='#28B463'
              onPress={ () => guardarDato() }
          />
          </View>
      <View style={styles.item}>
      <Text style={styles.subtitulo}>
      {lista.length > 0 ? 'Lista de alumnos' : 'No hay alumnos, agrega uno'}
      </Text>
      {lista?(<FlatList
          data={lista}
          renderItem={({item})=>(<Text><Text style={estilo.negrita}>* Nombre:</Text> {item.nombre} <Text style={estilo.negrita}>Carrera:</Text> {item.carrera} <Text style={estilo.negrita}>Edad:</Text> {item.edad}
              <Button
            title="X"
            color='#808000'
            style={styles.btnEliminar}
            onPress={ () => eliminarDato(item.id) }
          />
    </Text> )}
          keyExtractor={item => item.id}
            />) :null}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    padding:90,
    marginTop:2,
    backgroundColor: '#EAFAF1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  encabezado: {
    marginBottom: 20,
    fontSize: 24,
    marginTop:70,
    padding:3
  },
  input: {
    borderColor: '#666',
    borderBottomWidth: 1,
    width: 300,
    height: 40
  },
  btnEliminar: {
    color: '#f9c2f6',
    marginTop: 20,
    padding: 10
  },
  item: {
    backgroundColor: '#ABEBC6',
    color:'#666',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16
  },
    titulo: {
    color: '#666',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subtitulo: {
    color: '#666',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

const estilo = StyleSheet.create({
  boton: {
    width:300,
    borderRadius:8,
    borderWidth:1,
    marginTop: 10,
    marginBotton: 10
  },
  negrita: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold'
  },
});