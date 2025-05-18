import { StatusBar } from 'expo-status-bar';
import { ScrollView, 
         StyleSheet, 
         Text, 
         View, 
         Dimensions,
         ActivityIndicator,
         TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  // Weather API Key 설정 => 추후, Server로 옮길 예정
  const API_KEY = "2b84443c64ef5958f1012caa09f26150"; 

  // [S] 현재 Location 설정 시작
  const [city, setCity] = useState("Loading...");
  const [day, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const askLocationPermission = async() => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const { coords:{ latitude, longitude }} = await Location.getCurrentPositionAsync({accuracy: 6});
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false});

    if(location[0].city != null){
      setCity(location[0].city);
    } else {
      setCity(location[0].region);
    }

    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const weatherJson = await weatherRes.json();
    setDays(weatherJson);

  }

  useEffect(() => {
    askLocationPermission();
  }, []);
  // [E] 현재 Location 설정 종료

  // [S] 날씨 Icon Hash map 설정 시작
  const icons = {
    Clear : "day-sunny",
    Clouds : "cloudy",
    Atmosphere : "cloudy-gusts",
    Snow : "snow",
    Rain : "rains",
    Drizzle : "rain",
    Thunderstorm : "lightning",
  };

  // [E] 날씨 Icon Hash map 설정 종료

  // 1. View 내에는 text를 작성할 수 없음.
  // 2. react native에서는 일부 사용불가한 style이 존재함. ex) border
  // StyleSheet.create => object를 생성할 때 사용함. (자동 완성 기능을 제공함.)
  // 모든 View는 기본적으로 Flex Container이다.
  // FlexBox
  // 부모 View에 flex를 적용한 후, 자식 View에 flex를 적용해야 FlexBox 적용 가능
  return (
    <View style={customStyle.wrap}>
      <StatusBar style="black"></StatusBar>
      <View style={customStyle.cityWrap}>
        <View style={customStyle.backBtn}>
          <TouchableOpacity onPress={() => alert('clicked!')}>
            <Fontisto name="nav-icon-a" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={customStyle.mainTitle}>
          <Text style={customStyle.cityTitle}>{city}</Text>
        </View>
        <View style={customStyle.userIcon}>
          <TouchableOpacity onPress={() => alert('loginIn!')}>
            <FontAwesome5 name="user" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView pagingEnabled 
                  horizontal 
                  showsHorizontalScrollIndicator={false}>

        {day.length === 0 ? (
            <View style={customStyle.noTempWrap}>
              <ActivityIndicator size={'large'} color={'#d9d9d9'} />
            </View>
          ) : ( 
            <View style={customStyle.tempWrap}>
              <Text style={customStyle.tempText}>
                {parseFloat(day.main.temp).toFixed(1)}
              </Text>
              <View style={customStyle.weatherWrap}>
                <Fontisto name={icons[day.weather[0].main]} size={24} color="black" />
                <Text style={customStyle.weatherText}>
                  {day.weather[0].main}
                </Text>
              </View>
            </View>
          )
        }
      </ScrollView>
      <View>

      </View>
    </View>
  );
}

const customStyle = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cityWrap : {
    flex: 0.2,
    marginTop: 20,
    paddingBottom: -20,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  cityTitle : {
    position: "fixed",
    color: "#111",
    fontSize: 22,
    fontWeight: "500"
  },  
  weatherWrap : {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  tempWrap : {
    width: SCREEN_WIDTH,
    alignItems: "left",
    marginLeft: 20
  },
  noTempWrap : {
    width: SCREEN_WIDTH,
    alignItems: "center",
    marginTop: -10,
    paddingTop: 10
  },
  tempText : {
    fontSize: 80,
    marginTop: 50,
  },
  weatherText : {
    fontSize: 20,
    marginTop: 0,
    marginLeft: 10,
  },
  backBtn : {
    justifyContent: "flex-start",
    marginLeft: 20,
  },
  userIcon : {
    justifyContent: "flex-end",
    marginRight: 20,
  }
  
});
