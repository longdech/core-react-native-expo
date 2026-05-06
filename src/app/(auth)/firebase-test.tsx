import React from 'react';
import { FlatList, Text, View } from 'react-native';

import { useFirebaseRealtime } from '@/services/firebase';

export default function CustomerScreen() {
  const { data } = useFirebaseRealtime<any>('notifications/');

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View>
            <Text>{item?.message}</Text>
          </View>
        )}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}
