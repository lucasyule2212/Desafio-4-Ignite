/* eslint-disable no-shadow */
import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  title: string;
  url: string;
  description: string;
  ts: number;
  id: string;
};

type GetImagesResponse = {
  after: string;
  data: Image[];
};

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // TODO AXIOS REQUEST WITH PARAM
    async ({ pageParam = null }): Promise<GetImagesResponse> => {
      const { data } = await api.get('/api/images', {
        params: {
          after: pageParam,
        },
      });

      return data;
    },
    // TODO GET AND RETURN NEXT PAGE PARAM
    {
      getNextPageParam: lastPage => {
        return lastPage?.after || null;
      },
    }
  );

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    const flattenDataArray = data?.pages.flatMap(imageData => {
      return imageData.data.flat();
    });
    return flattenDataArray;
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading && !isError) {
    return <Loading />;
  }

  // TODO RENDER ERROR SCREEN
  if (isError && !isLoading) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {hasNextPage && (
          <Button
            onClick={() => {
              fetchNextPage();
            }}
            isLoading={isFetchingNextPage}
            loadingText="Carregando..."
            variantColor="teal"
            variant="outline"
            size="lg"
            mt={20}
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
