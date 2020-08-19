import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Switch } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTrendingRepo } from '../../store/actions';
import { Text, Button, HeaderButtons } from '../../common';
import { NAVIGATION_TO_DETAIL_SCREEN } from '../../navigation';
import { Status } from '../../api';
import { translate } from '../../i18n';
import { ThemeContext, lightTheme, darkTheme } from '../../theme';
import { HeaderButton } from 'react-navigation-header-buttons';
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
  /**
   * @source react-navigation
   */
  navigation,
}) => {
  const [isDarkTheme, toggleDarkTheme] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    // componentDidMount
    _getTrendingRepo();
    navigation.setOptions({title:'Contacts Pro'})
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
              <HeaderButtons.Item
                title={translate('common.drawerButton')}
                iconName="menu"
                onPress={navigation.openDrawer}
              />
            </HeaderButtons>
      ),
    });
  }, []);

  const toggleSwitch = state => {
    // If switch is on, set dark theme, else light
    toggleDarkTheme(state);
    setTheme(state ? darkTheme : lightTheme);
  }

  return (
    <ScrollView style={styles.container(theme)}>
      <View>
        <Text>{translate('homeScreen.darkMode')}</Text>
        <Switch
          onValueChange={toggleSwitch}
          value={isDarkTheme}
        />

        <Button title={translate('homeScreen.detailButton')} onPress={() => navigation.navigate(NAVIGATION_TO_DETAIL_SCREEN)} />
        <Button title={'Change title'} onPress={() => navigation.setOptions({title:'Best'})} />
        <Text>{`${translate('homeScreen.apiCallStatus')} : ${status}`}</Text>
        {errorMessage !== '' && (<Text>{errorMessage}</Text>)}
        <Text>{JSON.stringify(items)}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.backgroundColor,
  }),
});

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  getTrendingRepo: PropTypes.func.isRequired,
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

export default connect(mapStateToProps, { getTrendingRepo })(HomeScreen);
