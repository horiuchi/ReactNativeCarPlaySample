import * as qs from 'query-string';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Text, View} from 'react-native';
import {CarPlay, ListTemplate} from 'react-native-carplay';
import {ListItem} from 'react-native-carplay/lib/interfaces/ListItem';
import {getDistanceString} from '../utils/distance';
import {useFetch} from '../utils/useFetch';
import {Details} from './Details';
import {BukItem, getStatusImage} from './types';

const title = 'タイムズの駐車場';
const e = 1e-2; // about 1km
const opts = {};

export interface StationsProps {
  lat: number;
  lon: number;
}

export const Stations: React.VFC<StationsProps> = ({lat, lon}) => {
  const [selected, setSelected] = useState<BukItem>();

  useEffect(() => {
    const listTemplate = new ListTemplate({
      title,
      sections: [],
    });

    console.log('Stations.setRootTemplate: 1');
    CarPlay.setRootTemplate(listTemplate);
    return () => {
      console.log('Stations.popToRootTemplate: 1');
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
  const parseData = useCallback(async (res: Response): Promise<BukItem[]> => {
    const json = await res.json();
    if (Array.isArray(json?.value?.bukList)) {
      return json.value.bukList;
    }
    return [];
  }, []);
  const {loading, error, data} = useFetch(url, opts, parseData);
  useEffect(() => {
    if (data == null) {
      return;
    }

    function convert(item: BukItem): ListItem {
      return {
        image: getStatusImage(item.icon),
        text: item.name,
        detailText: getDistanceString(lat, lon, item.lat, item.lon),
        showsDisclosureIndicator: true,
      };
    }
    const available: BukItem[] = [];
    const full: BukItem[] = [];
    for (const item of data) {
      if (item.icon === 2) {
        full.push(item);
      } else {
        available.push(item);
      }
    }

    const listTemplate = new ListTemplate({
      title,
      sections: [
        {
          header: '空きあり',
          items: available.map(convert),
        },
        {
          header: '満車',
          items: full.map(convert),
        },
      ],
      onItemSelect: async ev => {
        const index = ev.index;
        const item =
          index >= available.length
            ? full[index - available.length]
            : available[index];
        setSelected(item);
      },
    });

    console.log('Stations.setRootTemplate: 2');
    CarPlay.setRootTemplate(listTemplate);
    return () => {
      console.log('Stations.popToRootTemplate: 2');
      CarPlay.popToRootTemplate(true);
    };
  }, [data, lat, lon]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Loading: {loading}</Text>
      <Text>Error: {error}</Text>
      <Text>Data Count: {data == null ? 0 : data.length}</Text>
      <Text>Selected: {selected?.no}</Text>
      {selected == null ? null : <Details item={selected} />}
    </View>
  );
};
