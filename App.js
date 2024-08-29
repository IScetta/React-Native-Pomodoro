import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,  } from 'react-native';
import Header from './src/components/Header';
import Timer from './src/components/Timer';
import {Audio} from "expo-av"

const colors = ["#F7DC6F", "#A2D9CE", "#D7BDE2"]

export default function App() {

  const [time, setTime] = useState(25*60);
  const [currentTime,setCurrentTime] = useState("POMO" | "SHORT" | "BREAK");
  const [isActive, setIsActive] = useState(false);

  useEffect(()=>{
    let interval = null;
    if(isActive){
      interval = setInterval(()=>{
        setTime(time - 1)
      },10)
    }else{
      clearInterval(interval)
    }

    if(time===0){
      setIsActive(false)
      setTime(currentTime === 1 ? 300 : currentTime === 0 ? 1500 : 900)
      alert("Finish Time")
    }

    return ()=>clearInterval(interval)
  },[isActive,time])

  function handleStartStop(){
    playSound()
    setIsActive(!isActive)
  }

  async function playSound(){
    const {sound} = await Audio.Sound.createAsync(
      require("./assets/Click.mp3")
    )
    await sound.playAsync();
   }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors[currentTime]}]}>
      <View style={{flex:1, paddingHorizontal:15, paddingTop: Platform.OS === "android" && 35}}>
      <Text style={{fontSize:32, fontWeight:"bold"}}>Pomodoro</Text>
      <Header setTime={setTime} currentTime={currentTime} setCurrentTime={setCurrentTime}/>
      <Timer time={time}/>
      <TouchableOpacity onPress={handleStartStop} style={styles.button}>
        <Text style={{color:"white", fontWeight:"bold"}}>{isActive ? "STOP" : "START"}</Text>
      </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button:{
    alignItems:"center",
    backgroundColor:"#333333",
    marginTop:15,
    padding:15,
    borderRadius: 15
  }
});
