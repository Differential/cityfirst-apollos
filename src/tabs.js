import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Image, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationService,
  withTheme,
  useTheme,
  Icon,
  Touchable,
} from '@apollosproject/ui-kit';
import { useApolloClient } from '@apollo/client';
import {
  createFeatureFeedTab,
  UserAvatarConnected,
  ConnectScreenConnected,
} from '@apollosproject/ui-connected';
import { checkOnboardingStatusAndNavigate } from '@apollosproject/ui-onboarding';
import { Appearance } from 'react-native';

const HeaderLogo = () => {
  const theme = useTheme();
  const deviceColorScheme = Appearance.getColorScheme();
  return (
    <Icon
      name="brand-icon"
      size={theme.sizing.baseUnit * 1.5}
      fill={deviceColorScheme === 'light' ? theme.colors.primary : '#ffffff'}
    />
  );
};

const ProfileButton = () => {
  const navigation = useNavigation();
  return (
    <Touchable
      onPress={() => {
        navigation.navigate('UserSettingsNavigator');
      }}
    >
      <View>
        <UserAvatarConnected size="xsmall" />
      </View>
    </Touchable>
  );
};

const SearchButton = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  return (
    <Touchable
      onPress={() => {
        navigation.navigate('Search');
      }}
    >
      <View>
        <Icon
          name="search"
          size={theme.sizing.baseUnit * 2}
          fill={theme.colors.primary}
        />
      </View>
    </Touchable>
  );
};

const tabBarIcon = (name) => {
  function TabBarIcon({ color }) {
    return <Icon name={name} fill={color} size={24} />;
  }
  TabBarIcon.propTypes = {
    color: PropTypes.string,
  };
  return TabBarIcon;
};

// we nest stack inside of tabs so we can use all the fancy native header features
const HomeTab = createFeatureFeedTab({
  screenOptions: {
    headerHideShadow: true,
    headerCenter: HeaderLogo,
    headerLeft: ProfileButton,
    headerLargeTitle: false,
  },
  tabName: 'Home',
  feedName: 'HOME',
});

const ExploreTab = createFeatureFeedTab({
  options: {
    headerLeft: ProfileButton,
    headerRight: SearchButton,
  },
  tabName: 'Explore',
  feedName: 'READ',
  tabProps: {
    useTagFilter: true,
  },
});

const WatchTab = createFeatureFeedTab({
  options: {
    headerLeft: ProfileButton,
  },
  tabName: 'Watch',
  feedName: 'WATCH',
});

const GiveTab = createFeatureFeedTab({
  options: {
    headerLeft: ProfileButton,
  },
  tabName: 'Give',
  feedName: 'PRAY',
});

const ConnectTab = createFeatureFeedTab({
  options: {
    headerLeft: ProfileButton,
  },
  tabName: 'Connect',
  feedName: 'CONNECT',
});

const { Navigator, Screen } = createBottomTabNavigator();

const TabNavigator = () => {
  const client = useApolloClient();
  // this is only used by the tab loaded first
  // if there is a new version of the onboarding flow,
  // we'll navigate there first to show new screens
  useEffect(() => {
    checkOnboardingStatusAndNavigate({
      client,
      navigation: NavigationService,
      navigateHome: false,
    });
  }, [client]);
  return (
    <Navigator lazy>
      <Screen
        name="Home"
        component={HomeTab}
        options={{ tabBarIcon: tabBarIcon('house-line') }}
      />
      <Screen
        name="Watch"
        component={WatchTab}
        options={{ tabBarIcon: tabBarIcon('youtube-logo') }}
      />
      <Screen
        name="Explore"
        component={ExploreTab}
        options={{ tabBarIcon: tabBarIcon('compass') }}
      />
      <Screen
        name="Give"
        component={GiveTab}
        options={{ tabBarIcon: tabBarIcon('currency-circle-dollar') }}
      />
      <Screen
        name="Connect"
        component={ConnectTab}
        options={{ tabBarIcon: tabBarIcon('profile') }}
      />
    </Navigator>
  );
};

export default TabNavigator;
