import React from 'react';
import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

const rosen_api_key = "tpexg3BLKOVuVGz2b8YxfYae";
const myHtmlFile = require("./index.html");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start_station_name: "",
      start_station_code: null,
      via_station_name: "",
      via_station_code: "",
      select_mode: "start"
    }
  }

  loadEnd = () => {
    if (this.webview) {
      const data = {
        type: "init_map",
        api_key: rosen_api_key
      };
      this.webview.postMessage(JSON.stringify(data));
    }
  }

  onMessage = e => {
    try {
      const value = JSON.parse(e.nativeEvent.data);
      if (value.name && value.code) {
        if (this.state.select_mode === 'start') {
          this.setState({
            start_station_name: value.name,
            start_station_code: value.code,
            select_mode: 'via'
          })
        } else {
          this.setState({
            via_station_name: value.name,
            via_station_code: value.code,
            select_mode: 'start'
          })
        }
      }
    } catch (error) {
      console.log("invalid json data");
    }
  }

  search = () => {
    // 未実装
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 12}}>
          <WebView
            source={myHtmlFile}
            ref={webview => {this.webview = webview}}
            onLoadEnd={this.loadEnd}
            onMessage={this.onMessage}
          />
        </View>
        <View style={styles.stationNameAndButtonContainer}>
          <View style={styles.stationNameLines}>
            <View style={styles.stationName}>
              <Text>出発駅: {this.state.start_station_name}</Text>
            </View>
            <View style={styles.stationName}>
              <Text>到着駅: {this.state.via_station_name}</Text>
            </View>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={() => this.search()}>
              <Text>検索</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stationNameAndButtonContainer: {
    flex: 2,
    flexDirection: 'row',
  },
  stationNameLines: {
    flex: 3,
  },
  stationName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
