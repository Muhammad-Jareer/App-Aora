import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons"; 

const TabIcon = ({ name, color, size = 24 }) => {
  return <FontAwesome name={name} size={size} color={color} />;
};

// Define the tab screens and their configurations
const tabsScreen = [
  { name: "home", title: "Home", icon: "home" },
  { name: "create", title: "Create", icon: "plus" },
  { name: "profile", title: "Profile", icon: "user" },
  { name: "bookmark", title: "Bookmark", icon: "bookmark" },
];

const TabsLayout = () => {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#FFA001',
        tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle: {
          backgroundColor: '#161622',
          borderTopColor: '#232533',
          height: 60,
          paddingBottom: 10,
        }
      }}
    >
      {tabsScreen.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name} 
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <TabIcon name={tab.icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabsLayout;
