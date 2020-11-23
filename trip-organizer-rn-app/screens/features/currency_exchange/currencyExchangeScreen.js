import React, { useState, useCallback, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Diamentions,
  Button,
  ImageBackground,
} from "react-native";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";

import { useDispatch, useSelector } from "react-redux";

import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import * as currenciesActions from "../../../store/actions/currencies";

const currencyExchangeScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  const [fromPicker, setFromPicker] = useState("PLN");
  const [toPicker, setToPicker] = useState("EUR");
  const [fromValue, setFromValue] = useState(0);
  const [toValue, setToValue] = useState(0);
  const base = useSelector((state) => state.currencies.base);
  const rates = useSelector((state) => state.currencies.rates);
  const dispatch = useDispatch();

  const loadRates = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(currenciesActions.getRates(fromPicker));
    } catch (err) {
      setError(err.message);
    }
    setToValue(fromValue * rates[toPicker]);
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError, fromPicker]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", loadRates);

    return () => {
      willFocusSub.remove();
    };
  }, [loadRates]);

  useEffect(() => {
    setIsLoading(true);
    loadRates(fromPicker).then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadRates]);

  return (
    <View style={styles.screen}>
      <View style={styles.mainContainer}>
        <View style={styles.fromContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={fromPicker}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              onValueChange={(itemValue, itemIndex) => {
                setFromPicker(itemValue);
                setFromValue("");
                setToValue("");
                // setToValue(
                //   (parseFloat(fromValue) * parseFloat(rates[toPicker]))
                //     .toFixed(2)
                //     .toString()
                // );
              }}
            >
              <Picker.Item label="US dollar" value="USD" />
              <Picker.Item label="Japanese yen " value="JPY" />
              <Picker.Item label="Euro" value="EUR" />
              <Picker.Item label="Bulgarian lev" value="BGN" />
              <Picker.Item label="Czech koruna" value="CZK" />
              <Picker.Item label="Danish krone" value="DKK" />
              <Picker.Item label="Pound sterling" value="GBP" />
              <Picker.Item label="Hungarian forint" value="HUF" />
              <Picker.Item label="Polish zloty" value="PLN" />
              <Picker.Item label="Romanian leu" value="RON" />
              <Picker.Item label="Swedish krona" value="SEK" />
              <Picker.Item label="Swiss franc" value="CHF" />
              <Picker.Item label="Icelandic krona" value="ISK" />
              <Picker.Item label="Norwegian krone" value="NOK" />
              <Picker.Item label="Croatian kuna" value="HRK" />
              <Picker.Item label="Russian rouble" value="RUB" />
              <Picker.Item label="Turkish lira" value="TRY" />
              <Picker.Item label="Australian dollar" value="AUD" />
              <Picker.Item label="Brazilian real" value="BRL" />
              <Picker.Item label="Canadian dollar" value="CAD" />
              <Picker.Item label="Chinese yuan renminbi" value="CNY" />
              <Picker.Item label="Hong Kong dollar" value="HKD" />
              <Picker.Item label="Indonesian rupiah" value="IDR" />
              <Picker.Item label="Israeli shekel" value="ILS" />
              <Picker.Item label="Indian rupee" value="INR" />
              <Picker.Item label="South Korean won" value="KRW" />
              <Picker.Item label="Mexican peso" value="MXN" />
              <Picker.Item label="Malaysian ringgit" value="MYR" />
              <Picker.Item label="New Zealand dollar" value="NZD" />
              <Picker.Item label="Philippine peso" value="PHP" />
              <Picker.Item label="Singapore dollar" value="SGD" />
              <Picker.Item label="Thai baht" value="THB" />
              <Picker.Item label="South African rand" value="ZAR" />
            </Picker>
          </View>
          <View style={styles.texFieldContainer}>
            <TextInput
              value={fromValue}
              style={styles.textInput}
              autoFocus={true}
              blurOnSubmit={true}
              keyboardType="decimal-pad"
              onChangeText={(text) => {
                text = text.replace(",", ".");
                setFromValue(text);
                setToValue(
                  (parseFloat(text) * parseFloat(rates[toPicker]))
                    .toFixed(2)
                    .toString()
                );
              }}
            />
          </View>
        </View>
        <View style={styles.middleContainer}>
          <View style={styles.swapContainer}>
            <TouchableOpacity
              style={styles.swapTile}
              onPress={() => {
                const tmpCurrency = fromPicker;
                setFromPicker(toPicker);
                setToPicker(tmpCurrency);
                setToValue("");
                setFromValue("");
              }}
            >
              <MaterialIcons name="swap-vert" size={32} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.currencyInfoContainer}>
            <View style={styles.currencyInfoTile}>
              <Text style={styles.currencyInfoText}>
                1 {fromPicker} = {rates[toPicker].toFixed(2)} {toPicker}
                {/* 1 {fromPicker} = {toPicker} */}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.fromContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={toPicker}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              onValueChange={(itemValue, itemIndex) => {
                setToPicker(itemValue);
                setToValue(
                  (parseFloat(fromValue) * parseFloat(rates[itemValue]))
                    .toFixed(2)
                    .toString()
                );
              }}
            >
              <Picker.Item label="US dollar" value="USD" />
              <Picker.Item label="Japanese yen " value="JPY" />
              <Picker.Item label="Euro" value="EUR" />
              <Picker.Item label="Bulgarian lev" value="BGN" />
              <Picker.Item label="Czech koruna" value="CZK" />
              <Picker.Item label="Danish krone" value="DKK" />
              <Picker.Item label="Pound sterling" value="GBP" />
              <Picker.Item label="Hungarian forint" value="HUF" />
              <Picker.Item label="Polish zloty" value="PLN" />
              <Picker.Item label="Romanian leu" value="RON" />
              <Picker.Item label="Swedish krona" value="SEK" />
              <Picker.Item label="Swiss franc" value="CHF" />
              <Picker.Item label="Icelandic krona" value="ISK" />
              <Picker.Item label="Norwegian krone" value="NOK" />
              <Picker.Item label="Croatian kuna" value="HRK" />
              <Picker.Item label="Russian rouble" value="RUB" />
              <Picker.Item label="Turkish lira" value="TRY" />
              <Picker.Item label="Australian dollar" value="AUD" />
              <Picker.Item label="Brazilian real" value="BRL" />
              <Picker.Item label="Canadian dollar" value="CAD" />
              <Picker.Item label="Chinese yuan renminbi" value="CNY" />
              <Picker.Item label="Hong Kong dollar" value="HKD" />
              <Picker.Item label="Indonesian rupiah" value="IDR" />
              <Picker.Item label="Israeli shekel" value="ILS" />
              <Picker.Item label="Indian rupee" value="INR" />
              <Picker.Item label="South Korean won" value="KRW" />
              <Picker.Item label="Mexican peso" value="MXN" />
              <Picker.Item label="Malaysian ringgit" value="MYR" />
              <Picker.Item label="New Zealand dollar" value="NZD" />
              <Picker.Item label="Philippine peso" value="PHP" />
              <Picker.Item label="Singapore dollar" value="SGD" />
              <Picker.Item label="Thai baht" value="THB" />
              <Picker.Item label="South African rand" value="ZAR" />
            </Picker>
          </View>
          <View style={styles.texFieldContainer}>
            <TextInput
              value={toValue}
              style={styles.textInput}
              blurOnSubmit={true}
              keyboardType="decimal-pad"
              onChangeText={(text) => {
                console.log(text);
                setToValue(text);
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

currencyExchangeScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Exchange Currency",
  };
};

const styles = StyleSheet.create({
  swapTile: {
    padding: 5,
    backgroundColor: "black",
    borderRadius: 30,
  },
  currencyInfoText: {
    color: "white",
  },
  currencyInfoTile: {
    height: "100%",
    backgroundColor: "black",
    borderRadius: 20,
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
  },
  swapContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  currencyInfoContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    color: "white",
    fontSize: 30,
    textAlign: "right",
    marginHorizontal: 10,
    paddingVertical: 4,
  },
  picker: {
    paddingHorizontal: 10,
    // height: 100,
  },
  pickerItem: {
    color: "white",
  },

  pickerContainer: {
    width: "70%",
  },
  texFieldContainer: {
    width: "30%",
    justifyContent: "center",
  },
  fromContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 200,
  },
  middleContainer: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 7,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  screen: {
    flex: 1,
    backgroundColor: "#2C2C2E",
  },
});
export default currencyExchangeScreen;
