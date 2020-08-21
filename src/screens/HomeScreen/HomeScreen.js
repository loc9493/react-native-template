import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Switch, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTrendingRepo, getContactsRepo } from '../../store/actions';
import { Text, Button, HeaderButtons } from '../../common';
import { NAVIGATION_TO_DETAIL_SCREEN } from '../../navigation';
import { Status } from '../../api';
import { translate } from '../../i18n';
import { ThemeContext, lightTheme, darkTheme } from '../../theme';
import { HeaderButton } from 'react-navigation-header-buttons';
import { FlatList } from 'react-native-gesture-handler';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import FastImage from 'react-native-fast-image'
import { pathOr } from 'ramda';

const HomeScreen = ({
  /**
   * Tells about the status of get trendending repo api call
   *
   * if status === Status.DEFAULT => api hasn't been hit yet
   * if status === Status.LOADING => api is currently being executed
   * if status === Status.SUCCESS => success response from api
   * if status === Status.ERROR   => error response from api
   *
   * @source: redux
   */
  status,
  /**
   * Contains the error message from server, when status === Status.ERROR
   *
   * @source: redux
   */
  errorMessage,
  /**
   * Array, which store trendeing repository data
   *
   * @source: redux
   */
  items,
  /**
   * redux action to initiate get trending repo api request
   *
   * @source: redux
   */
  getTrendingRepo: _getTrendingRepo,
  getContactsRepo: _getContactsRepo,
  /**
   * @source react-navigation
   */
  navigation,
}) => {
  const [isDarkTheme, toggleDarkTheme] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  useEffect(() => {
    // componentDidMount
    // _getTrendingRepo();
    _getContactsRepo();
    navigation.setOptions({title:'Contacts Pro'})
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
              <HeaderButtons.Item
                title={translate('common.drawerButton')}
                iconName="add"
                onPress={navigation.openDrawer}
              />
            </HeaderButtons>
      ),
    });
  }, []);
  renderItem = (item) =>{
    console.log(item.index)
    const thumbnailPath = item.item.thumbnailPath
    const firstChar = pathOr('', ['item', 'givenName', 0], item) + pathOr('', ['item', 'familyName', 0], item)
    const firstNumber = pathOr('', ['item', 'phoneNumbers', 0, 'number'], item)
    if (!item.color) {
      // item.color = 'hsl(' + Math.floor(Math.random() * 360) + ', 70%, 50%)'
      item.color = 'green'
    }
    return <View style={{flexDirection:'row', margin: 10}}>
          <View style={[styles.thumbnailAvatar, {backgroundColor: item.color}]}>
          {thumbnailPath.length>0 ? <Image style={{ width: 40, height: 40 }} source={{
          uri: thumbnailPath,
        }}></Image> : <Text style={styles.thumbnailText}>{firstChar}</Text>}
          </View>
          <View style={{flexDirection:'column'}}>
            <Text style={styles.contactName}>{item.item.givenName} {item.item.familyName}</Text>
            <Text style={styles.contactNumber}>{firstNumber}</Text>
          </View>
          
      </View>
  }
  const toggleSwitch = state => {
    // If switch is on, set dark theme, else light
    toggleDarkTheme(state);
    setTheme(state ? darkTheme : lightTheme);
  }

  return (
    <FlatList style={styles.container(theme)} 
    data={items}
        renderItem={renderItem}
        keyExtractor={item => item.index}>
    </FlatList>
  );
};

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.backgroundColor,
  }),
  thumbnailAvatar: {
    width: 40, height: 40, marginRight:10, borderRadius:20,
    justifyContent: 'center',
    alignItems:'center',
    fontWeight: '900',
  },
  thumbnailText: {
    color: 'white',
    fontSize: 18
  },
  contactName: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom:3
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: '400'
  }
});

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  getTrendingRepo: PropTypes.func.isRequired,
  getContactsRepo: PropTypes.func.isRequired,
  status: PropTypes.oneOf(Object.values(Status)).isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  errorMessage: PropTypes.string,
};

HomeScreen.defaultProps = {
  items: [],
  errorMessage: '',
};

const mapStateToProps = ({ home }) => {
  const { status, errorMessage, items } = home;
  return {
    items,
    status,
    errorMessage,
  };
}

const mapDispatchToProps = {
  getTrendingRepo, // will be wrapped into a dispatch call
  getContactsRepo, // will be wrapped into a dispatch call
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
