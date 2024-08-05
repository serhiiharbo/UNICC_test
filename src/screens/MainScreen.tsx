import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
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
import {
  DEBOUNCE_TIMEOUT,
  IMAGE_PLACEHOLDER,
  REQUEST_STATUS,
} from '../constants';

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
  currentPage: number;
  totalPages: number;
}

const MainScreen: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const dispatch: AppDispatch = useDispatch();
  const {results, status, error, currentPage, totalPages}: MovieSelectorProps =
    useSelector((state: RootState) => state.movies);

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flatListRef = useRef<FlatList<MovieItemProps>>(null);

  const fetchDebouncedMovies = (query: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      // Perform the API call if the query is not empty
      if (query.trim().length > 0) {
        dispatch(fetchMovies({query, page: 1}));
        // Scroll to top when new data is fetched
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({animated: true, offset: 0});
        }
      }
    }, DEBOUNCE_TIMEOUT);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handleSearchInputChange = (text: string): void => {
    // Purge the movies when the input is empty
    if (text.trim().length === 0) {
      setQuery('');
      dispatch(purgeMovies());
      return;
    }
    setQuery(text);
    fetchDebouncedMovies(text);
  };

  const handleLoadMore = useCallback((): void => {
    if (currentPage < totalPages && status !== REQUEST_STATUS.LOADING) {
      dispatch(fetchMovies({query, page: currentPage + 1}));
    }
  }, [currentPage, dispatch, query, status, totalPages]);

  const handlePurge = useCallback((): void => {
    setQuery('');
    dispatch(purgeMovies());
  }, [dispatch]);

  const handleClearCache = useCallback((): void => {
    dispatch(clearCache());
  }, [dispatch]);

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
        onChangeText={handleSearchInputChange}
        placeholder="Search movies"
      />
      {__DEV__ && (
        <Fragment>
          <Button title="Purge Movies" onPress={handlePurge} />
          <Button title="Clear Cache" onPress={handleClearCache} />
        </Fragment>
      )}
      {status === REQUEST_STATUS.LOADING && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}
      <FlatList
        ref={flatListRef}
        data={results}
        keyExtractor={(item, index) => `${item.id}-${index}-${currentPage}`}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          status === REQUEST_STATUS.LOADING && currentPage > 1 ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : null
        }
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
