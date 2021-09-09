import * as qs from 'query-string';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Text, View} from 'react-native';
import {CarPlay, ListTemplate} from 'react-native-carplay';
import {ListItem} from 'react-native-carplay/lib/interfaces/ListItem';
import {getDistanceString} from '../utils/distance';
import {useFetch} from '../utils/useFetch';

declare module 'react-native-carplay/lib/interfaces/ListItem' {
  export interface ListItem {
    id: string;
  }
}

const title = 'タイムズの駐車場';
const e = 1e-2; // about 1km
const opts = {};

export interface StationsProps {
  lat: number;
  lon: number;
}

function getIconImage(icon: 0 | 1 | 2 | 3 | 4) {
  switch (icon) {
    case 0:
      return require('../images/status-0.svg');
    case 1:
      return require('../images/status-1.svg');
    case 2:
      return require('../images/status-2.svg');
    default:
      return require('../images/status-3.svg');
  }
}

export const Stations: React.VFC<StationsProps> = ({lat, lon}) => {
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    const listTemplate = new ListTemplate({
      title,
      sections: [],
    });

    CarPlay.setRootTemplate(listTemplate);
    return () => {
      CarPlay.popToRootTemplate(true);
    };
  }, []);

  const url = useMemo(() => {
    return qs.stringifyUrl({
      url: 'https://times-info.net/view/teeda.ajax',
      query: {
        time: new Date().toString(),
        north: lat + e,
        south: lat - e,
        east: lon + e,
        west: lon - e,
        component: 'service_bukService',
        action: 'ajaxGetMapBukIcon',
        cors: 'xhr2',
      },
    });
  }, [lat, lon]);
  const parseData = useCallback(
    async (res: Response): Promise<ListItem[]> => {
      const json = await res.json();
      const result: ListItem[] = [];
      if (Array.isArray(json?.value?.bukList)) {
        for (const item of json.value.bukList) {
          result.push({
            id: item.no,
            image: getIconImage(item.icon),
            text: item.name,
            detailText: getDistanceString(lat, lon, item.lat, item.lon),
            showsDisclosureIndicator: true,
          });
        }
      }
      return result;
    },
    [lat, lon],
  );
  const {loading, error, data} = useFetch(url, opts, parseData);
  useEffect(() => {
    if (data == null) {
      return;
    }

    const listTemplate = new ListTemplate({
      title,
      sections: [
        {
          items: data,
        },
      ],
      onItemSelect: async e => {
        setSelected(data[e.index].id);
      },
    });

    CarPlay.setRootTemplate(listTemplate);
    return () => {
      CarPlay.popToRootTemplate(true);
    };
  }, [data]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Loading: {loading}</Text>
      <Text>Error: {error}</Text>
      <Text>Data Count: {data == null ? 0 : data.length}</Text>
      <Text>Selected: {selected}</Text>
    </View>
  );
};
