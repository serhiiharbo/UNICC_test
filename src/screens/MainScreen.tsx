import React, {Fragment, useState} from 'react';
import {
  Button,
  FlatList,
  Image,
  ListRenderItem,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IMAGE_BASE_URL} from '@env';

import {
  clearCache,
  fetchMovies,
  Movie,
  MovieStatus,
  purgeMovies,
} from '../store/movieSlice';
import {AppDispatch, RootState} from '../store/store';
import {IMAGE_PLACEHOLDER} from '../constants';

interface MovieItemProps {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
}

interface MovieSelectorProps {
  results: Movie[];
  status: MovieStatus;
  error: string | null;
}

const MainScreen: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const dispatch: AppDispatch = useDispatch();
  const {results, status, error}: MovieSelectorProps = useSelector(
    (state: RootState) => state.movies,
  );

  const handleSearch = (): void => {
    if (query.trim().length > 0) {
      dispatch(fetchMovies(query));
    }
  };

  const handlePurge = (): void => {
    setQuery('');
    dispatch(purgeMovies());
  };

  const handleClearCache = (): void => {
    dispatch(clearCache());
  };

  const renderItem: ListRenderItem<MovieItemProps> = ({item}) => (
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

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Search movies"
        onSubmitEditing={handleSearch}
      />
      {__DEV__ && (
        <Fragment>
          <Button title="Purge Movies" onPress={handlePurge} />
          <Button title="Clear Cache" onPress={handleClearCache} />
        </Fragment>
      )}
      {status === 'loading' && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}
      <FlatList
        data={results}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  input: {
    height: 40,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderColor: 'gray',
    borderWidth: 1,
  },
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

export default MainScreen;
