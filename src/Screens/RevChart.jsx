import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { BaseUrl } from "../Utils/Constrains";
import Loading from "../Utils/Loading";
// import { MainGreen } from "../../Constaint";
// import Orders from "../../../JSON/Orders.json";
// import * as ScreenOrientation from "expo-screen-orientation";
// ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)

const RevChart = ({ route }) => {
  const navigation = useNavigation();
  const [newData, setNewData] = useState([]);
  const [newSalesData, setnewSalesData] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const [pendingOrderCount, setpendingOrderCount] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [max, setMax] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [Orders, setOrders] = useState([]);



  const getOrders = (e, a) => {
    const data = "all";
    axios
      .post(
        BaseUrl + "/orders/getall",
        {
          UserEmail: e,
          authKey: a,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(function (response) {
        const da = response.data;
        console.log(da)
        setIsLoading(false)
        if (da.status == 103) {
          // console.log(da.orders)
          if (data == "all") {
            console.log(da)
            setOrders(da.orders);
          } else if (data == -1) {
            setOrders(
              da.orders.filter((value, index, array) => value.orderStatus == -1)
            );
          } else if (data == 0) {
            setOrders(
              da.orders.filter((value, index, array) => value.orderStatus === 0)
            );
          } else if (data == 1) {
            setOrders(
              da.orders.filter((value, index, array) => value.orderStatus === 1)
            );
          } else if (data == 2) {
            setOrders(
              da.orders.filter(
                (value, index, array) => value.isCancled === true
              )
            );
          } else {
            setOrders(da.orders);
          }
          getGraphData(da.orders);
          getTrendingProducts(da.orders);
          getPendingOrders(da.orders);
          // setIsLoading(false);
        } else {
          console.log("Failed to get Orders" + da.status);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getGraphData = () => {
    const temp = [];
    const tempSales = [];
    var tempM = 0;
    var temptotalSales = 0;

    // const today = new Date(Date.now()).getDate();
    const today = new Date("2024-7-30").getDate();
    var month = new Date(Date.now()).getMonth() + 1;
    if ((month.length = 1)) {
      month = "0" + month;
    }
    const yr = new Date(Date.now()).getFullYear();
    // const strD = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getDate();

    for (let index = 0; index < 30; index++) {
      var lab = today - index;
      if (lab <= 0) {
        lab = 30 + lab;
      }
      var val = 0;
      var sales = 0;
      const todayyr = Number("" + yr + month + lab);
      Orders.map((item) => {
        var od = item.orderDate.replace("/", "");
        if (Number(od.replace("/", "")) === todayyr) {
          val = val + item.productPrice;
          sales = sales + 1;
        }
      });
      temp[index] = { value: val, label: lab };

      tempSales[index] = { value: sales, label: lab };

      tempM = tempM + val;
      temptotalSales = temptotalSales + sales;
    }
    setNewData(temp.reverse());
    setnewSalesData(tempSales.reverse());
    setMax(tempM);
    setTotalSales(temptotalSales);
    setIsLoading(false);
  };

  useEffect(() => {
    // (async () => {
    //   await ScreenOrientation.lockAsync(
    //     ScreenOrientation.OrientationLock.LANDSCAPE
    //   );
    // })();
    getOrders()
  }, []);
  return isLoading ? <Loading/>: (
    <View style={{ flex: 1 ,width:'100%'}}>
      <View
        style={{
          borderRadius: 15,
          elevation: 5,
          backgroundColor: "white",
          padding: 5,
          alignItems: "center",
          justifyContent:'flex-end',
          width: "100%",
          height: "100%",
          marginVertical: 5,
          
        }}
      >
        <View
          style={{
            alignItems: "flex-start",
            marginLeft: 10,
            marginTop: 5,
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "rgba(204, 204, 204, 1)" }}>
              {route.params.type == "rev" ? "Revenue" : "Sales"}
            </Text>
            <Text
              style={{
                alignSelf: "flex-start",
                fontSize: 20,
                fontWeight: 600,
                // marginLeft: 10,
                marginBottom: 10,
                marginTop: 5,
              }}
            >
              Rs. {max}.00
            </Text>
          </View>
          <Text style={{ fontSize: 10, color: "rgba(204, 204, 204, 1)" }}>
            Past 30 days
          </Text>
        </View>

        <BarChart
          // horizontal
          barWidth={5}
          noOfSections={5}
          barBorderRadius={4}
          frontColor={"black"}
          data={route.params.type == "rev" ? newData : newSalesData}
          // maxValue={max}
          // maxValue={6000}
          yAxisThickness={1}
          xAxisThickness={0}
          xAxisLabelTextStyle={{ fontSize: 10, fontWeight: 600 }}
          yAxisTextStyle={{ fontSize: 10 }}
          isAnimated
          showLine
          lineConfig={{
            color: "grey",
            thickness: 2,
            curved: true,
            // hideDataPoints: true,
            // shiftY: 20,
            // initialSpacing: -30,
          }}
        />
        <TouchableOpacity
          style={{ marginTop: 10, marginBottom: 10 }}
          onPress={() => {
            navigation.navigate("RevChart");
          }}
        ></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default RevChart;
