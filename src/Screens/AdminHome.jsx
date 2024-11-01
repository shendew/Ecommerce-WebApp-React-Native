import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "../Utils/Loading";
import orderIc from "../img/checklist.png";
import proIC from "../img/products.png";
import { useNavigation } from "@react-navigation/native";
import { BarChart } from "react-native-gifted-charts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { FloatingAction } from "react-native-floating-action";

import { BaseUrl, Main } from "../Utils/Constrains";
import { parseISO, isBefore, isAfter } from "date-fns";
import { useUpdateAuth } from "../Context/AuthContext";

const AdminHome = () => {
  const navigation = useNavigation();
  const authHandler = useUpdateAuth();
  const [AuthKey, setAuthKey] = useState();
  const [UserEmail, setUserEmail] = useState();
  const [newData, setNewData] = useState([]);
  const [max, setMax] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [trendingItems, setTrendingItems] = useState([]);

  const [pendingOrderCount, setpendingOrderCount] = useState();
  const [newSalesData, setnewSalesData] = useState([]);
  const [Orders, setOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }];


  const actions = [
    {
      text: "Add Product",
      name: "pAdd",
      position: 1,
    },
  ];

  const getAuth = async () => {
    const auth = await AsyncStorage.getItem("AUTH_TOKEN");
    const email = await AsyncStorage.getItem("USER_EMAIL");
    setAuthKey(auth);
    setUserEmail(email);
    getOrders(email, auth);
  };

  const getTrendingProducts = (PassedOrders) => {
    var month = new Date(Date.now()).getMonth();
    var productIDs = [];
    var productIdsWithCount = [];
    PassedOrders.map((item) => {
      if (
        new Date(
          item.orderDate.replace("/", "-").replace("/", "-")
        ).getMonth() === month
      ) {
        productIDs.push(item.productID);
      }
    });

    const soldUniquePIDS = new Set(productIDs);

    soldUniquePIDS.forEach((item, index, array) => {
      var TempidCount = 0;
      productIDs.map((product_item) => {
        if (item == product_item) {
          TempidCount++;
        }
      });
      // console.log(item);
      productIdsWithCount.push({ productID: item, count: TempidCount });
    });

    setTrendingItems(productIdsWithCount);
  };

  const getPendingOrders = (PassedOrders) => {
    var tempCount = 0;
    PassedOrders.map((order) => {
      if (order.orderStatus == -1) {
        tempCount = tempCount + 1;
      }
    });
    setpendingOrderCount(tempCount);
  };

  const getGraphData = (PassedOrders) => {
    const temp = [];
    const tempSales = [];
    var tempM = 0;
    var temptotalSales = 0;

    const today = new Date(Date.now()).getDate();
    var month = new Date(Date.now()).getMonth() + 1;
    if ((month.length = 1)) {
      month = "0" + month;
    }
    const yr = new Date(Date.now()).getFullYear();
    // const strD = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getDate();

    for (let index = 0; index < 7; index++) {
      var lab = today - index;
      if (lab <= 0) {
        lab = 30 + lab;
      }
      var val = 0;
      var sales = 0;
      const todayyr = Number("" + yr + month + lab);
      const Fns_today = new Date();

      PassedOrders.map((item) => {
        // var od = item.orderDate.replace("/", "");
        var odm = new Date(parseISO(item.orderDate)).getMonth() + 1;
        if ((odm.length = 1)) {
          odm = "0" + odm;
        }
        var od =
          "" +
          new Date(parseISO(item.orderDate)).getFullYear() +
          odm +
          new Date(parseISO(item.orderDate)).getDate();
        if (Number(od) === todayyr) {
          console.log(Number(od) === todayyr);
          val = val + item.productPrice;
          sales = sales + 1;
        } else {
          console.log(od + "____" + todayyr);
        }
        // if (parseISO(item.orderDate) === Fns_today) {
        //   val = val + item.productPrice;
        //   sales = sales + 1;
        // }else{
        //   console.log(parseISO(item.orderDate) +"____"+ Fns_today)
        // }
      });
      temp[index] = { value: val, label: lab };
      // temp[index] = { value: val};

      tempSales[index] = { value: sales, label: lab };

      tempM = tempM + val;
      temptotalSales = temptotalSales + sales;
    }
    // console.log(temp);
    setNewData(temp.reverse());
    setnewSalesData(tempSales.reverse());
    setMax(tempM);
    setTotalSales(temptotalSales);
    setIsLoading(false);
  };

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

  useEffect(() => {
    // navigation.addListener("focus", () => {
    //   (async () => {
    //     await Scre.lockAsync(
    //       ScreenOrientation.OrientationLock.PORTRAIT
    //     );
    //   })();
    // });
    setIsLoading(true);
    console.log(isLoading)
    getAuth();
  }, []);

  return isLoading ? (
    <View style={{flex:1}}>
      <Loading />
    </View>
  ) : (
    <View style={{ backgroundColor: "rgba(241, 246, 232, 1)" }}>
      <ScrollView
        style={{ paddingHorizontal: 10, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            // paddingHorizontal: 25,
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              alignSelf: "flex-start",
              paddingVertical: 20,
              width: "100%",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{}}>
              <TouchableOpacity onPress={()=>{
                AsyncStorage.removeItem("AUTH_TOKEN")
                .then(() => {
                  console.log("Token removed successfully");
                  authHandler(false);
                })
                .catch((error) => {
                  Alert.alert("Please try again later.");
                  console.error("Error removing token:", error);
                });
              }}>
                
              <Text style={{ fontSize: 30, fontWeight: 600 }}>Dashboard</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 16, color: "rgba(121, 105, 31, 1)" }}>
                Welcome back, {"shopName"}
              </Text>
            </View>

            <Image
              source={{ uri: "shopImage" }}
              cachePolicy={"none"}
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: "white",
                elevation: 3,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <TouchableOpacity
              style={styles.topDashBoxes}
              onPress={() => {
                navigation.navigate("SellerOrdersView");
              }}
            >
              <View
                style={{
                  position: "absolute",
                  right: -10,
                  top: -10,
                  borderRadius: 15,
                  width: 30,
                  height: 30,
                  backgroundColor: "red",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: 18,
                    color: "white",
                  }}
                >
                  {pendingOrderCount}
                </Text>
              </View>
              <Image
                source={orderIc}
                style={{ width: 50, height: 50, marginBottom: 5 }}
              />
              <Text>Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.topDashBoxes}
              onPress={() => {
                navigation.navigate("SellerProductsView");
              }}
            >
              <Image
                source={proIC}
                style={{ width: 50, height: 50, marginBottom: 5 }}
              />
              <Text>Products</Text>
            </TouchableOpacity>
          </View>

          {/* charts */}

          <View
            style={{
              borderRadius: 15,
              elevation: 5,
              backgroundColor: "white",
              padding: 5,
              alignItems: "center",
              //   width: "100%",
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
              <View>
                <Text style={{ color: "rgba(204, 204, 204, 1)" }}>Revenue</Text>
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
                Past 7 days
              </Text>
            </View>

          <View>
            <BarChart
              barWidth={22}
              noOfSections={3}
              barBorderRadius={4}
              // frontColor={MainGreen}
              data={newData}
              maxValue={max}
              yAxisThickness={1}
              // xAxisLabelTexts={"lkr"}
              // yAxisLabelTexts={"days"}
              showVerticalLiness
              xAxisThickness={1}
              xAxisLabelTextStyle={{ fontSize: 10, fontWeight: 600 }}
              yAxisTextStyle={{ fontSize: 10 }}
              isAnimated
              showLine
              lineConfig={{
                color: "grey",
                thickness: 2,
              curved: true,
              // curvature:5,
              hideDataPoints: true,
              // shiftY: 20,
              // initialSpacing: -30,
              }}
            />
            <Text
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                fontSize: 11,
              }}
            >
              days
            </Text>
          </View>

          <TouchableOpacity
              style={{ marginTop: 10, marginBottom: 10 }}
              onPress={() => {
                navigation.push("RevChart", { type: "rev" });
              }}
            >
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 15,
                  backgroundColor: Main,
                }}
              >
                <Text style={{ color: "white" }}>View more</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              borderRadius: 15,
              elevation: 5,
              backgroundColor: "white",
              padding: 5,
              alignItems: "center",
              //   width: "100%",
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
              <View>
                <Text style={{ color: "rgba(204, 204, 204, 1)" }}>Sales</Text>
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
                  {totalSales}
                </Text>
              </View>
              <Text style={{ fontSize: 10, color: "rgba(204, 204, 204, 1)" }}>
                Past 7 days
              </Text>
            </View>
            <View>
              <BarChart
                barWidth={22}
                noOfSections={5}
                barBorderRadius={4}
                // frontColor={MainGreen}
                data={newSalesData}
                //   maxValue={max}
                // maxValue={6000}
                yAxisThickness={1}
                xAxisThickness={0}
                // xAxisLabelTexts={["lkr"]}
                // yAxisLabelTexts={["days"]}
                // showVerticalLines
                xAxisLabelTextStyle={{ fontSize: 10, fontWeight: 600 }}
                yAxisTextStyle={{ fontSize: 10 }}
                isAnimated
                showLine
                  lineConfig={{
                    color: 'grey',
                    thickness: 2,
                    curved: true,
                    // hideDataPoints: true,
                    // shiftY: 20,
                    // initialSpacing: -30,
                  }}
              />
              <Text
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  fontSize: 11,
                }}
              >
                days
              </Text>
            </View>

            <TouchableOpacity
              style={{ marginTop: 10, marginBottom: 10 }}
              onPress={() => {
                navigation.push("RevChart", { type: "sale" });
              }}
            >
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 15,
                  backgroundColor: Main,
                }}
              >
                <Text style={{ color: "white" }}>View more</Text>
              </View>
            </TouchableOpacity>
          </View>


          <Text
            style={{
              alignSelf: "flex-start",
              marginTop: 20,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Trending Products of month
          </Text>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 15,
              width: "100%",
              elevation: 3,
              padding: 10,
              marginTop: 20,
              alignItems: "center",
              marginBottom: 60,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "90%",
                marginBottom: 10,
                flex: 5,
              }}
            >
              <Text
                style={{
                  fontWeight: 600,
                  flex: 2,
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                Product
              </Text>
              <Text
                style={{
                  fontWeight: 600,
                  flex: 1,
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                Exp. Date
              </Text>
              <Text
                style={{
                  fontWeight: 600,
                  flex: 1,
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                Status
              </Text>
              <Text
                style={{
                  fontWeight: 600,
                  flex: 1,
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                Stock
              </Text>
            </View>
            <View
              style={{ height: 1, backgroundColor: "grey", width: "90%" }}
            ></View>
            {trendingItems
              .sort((a, b) => (a.count > b.count ? 1 : -1))
              .map((product) => {
                // return (
                //   <SellerItem
                //     key={product.productID}
                //     productID={product.productID}
                //   />
                // );
              })}
          </View>


        </View>
      </ScrollView>
      <FloatingAction
        backgroundColor={"rgba(17, 167, 151, 1)"}
        actions={actions}
        onPressItem={(item) => {
          navigation.navigate("AddProduct");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topDashBoxes: {
    backgroundColor: "white",
    flex: 1,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    elevation: 5,
    marginHorizontal: 20,
  },
  boldText: {
    fontWeight: 600,
  },
});

export default AdminHome;
