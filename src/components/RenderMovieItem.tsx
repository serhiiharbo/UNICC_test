import React from 'react';
import {Image, ListRenderItem, StyleSheet, Text, View} from 'react-native';
import {IMAGE_BASE_URL} from '@env';

import {IMAGE_PLACEHOLDER} from '../constants';

export interface MovieItemProps {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
}

const RenderMovieItem: ListRenderItem<MovieItemProps> = ({item}) => (
  <View style={styles.item}>
    <Image
      source={
        item.poster_path
          ? {uri: `${IMAGE_BASE_URL}${item.poster_path}`}
          : IMAGE_PLACEHOLDER
      }
      resizeMode="contain"
      style={styles.image}
    />
    <View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.year}>
        {new Date(item.release_date).getFullYear()}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: 50,
    height: 75,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  year: {
    fontSize: 14,
    color: 'gray',
  },
});

export default RenderMovieItem;
