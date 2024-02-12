import React from 'react';
import { Button, View } from 'react-native';

const Login = ({ onLogin }) => {
  return (
    <View>
      <Button title="Log In" onPress={onLogin} />
    </View>
  );
};

export default Login;