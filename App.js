import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, RefreshControl, Text, View, FlatList } from 'react-native'
import axios from 'axios';

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const App = () => {
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isrefresh, setIsrefresh] = useState(false);
  const [page, setpage] = useState(1);

  const renderItem = ({ item }) => (
    <Item title={item.display_name} />
  );
  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = (page = 1, isLoadMore = false) => {
    const url = `https://api.stackexchange.com/2.2/users?page=${page}&order=desc&sort=reputation&site=stackoverflow`;
    axios.get(url).then(r => {
      let newData = (isLoadMore) ? state.concat(r.data.items) : r.data.items;
      setState(newData);
      setLoading(false);
      setIsrefresh(false);
      setpage(page);
    });
  }
  const loadmore = () => {
    let newPage = page + 1;
    fetchUser(newPage, true);
  }
  const _onrefresh = () => {
    setIsrefresh(true);
    fetchUser();
  }
  return (
    <SafeAreaView>
      {(loading) == true ? (<View><Text>Loading...</Text></View>) : (<FlatList
        data={state}
        refreshControl={
          <RefreshControl
            progressBackgroundColor={"purple"}
            colors={["white"]}
            refreshing={isrefresh}
            onRefresh={_onrefresh}
          />
        }
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={.6}
        onEndReached={loadmore}
      />)}
      {/* <Text>Hello world</Text> */}
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 4,
  },
  title: {
    fontSize: 16,
  },
})
