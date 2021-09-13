import React, {useCallback, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {
  AlertTemplate,
  CarPlay,
  InformationTemplate,
} from 'react-native-carplay';
import {BukItem, getStatus} from './types';

const ActionIdDirection = 'direction';
const ActionIdReserve = 'reserve';

export interface DetailsProps {
  item: BukItem;
}

interface DirectionDialogProps {
  lat: number;
  lon: number;
  onClose: () => void;
}

const DirectionDialog: React.VFC<DirectionDialogProps> = ({
  lat,
  lon,
  onClose,
}) => {
  useEffect(() => {
    const dialog = new AlertTemplate({
      titleVariants: [
        'Go to the coordinates.',
        `latitude: ${lat.toFixed(6)}`,
        `longitude: ${lon.toFixed(6)}`,
      ],
      actions: [
        {
          id: 'ok',
          title: 'OK',
        },
      ],
      onActionButtonPressed: () => onClose(),
    });

    CarPlay.presentTemplate(dialog, true);
    return () => {
      CarPlay.dismissTemplate(true);
    };
  }, [lat, lon, onClose]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Showing DirectionDialog.</Text>
    </View>
  );
};

export const Details: React.VFC<DetailsProps> = ({item}) => {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    const template = new InformationTemplate({
      title: item.name,
      items: [
        {
          title: item.name,
          detail: getStatus(item.icon),
        },
        {
          title: '',
          detail: `最大 ${item.num}台`,
        },
      ],
      actions: [
        {
          id: ActionIdDirection,
          title: 'GO',
        },
        {
          id: ActionIdReserve,
          title: '予約',
        },
      ],
      onActionButtonPressed: e => {
        console.log('Details.onActionButtonPressed', e);
        switch (e.id) {
          case ActionIdDirection:
            setShowing(true);
            break;
          case ActionIdReserve:
            break;
        }
      },
    });

    console.log('Details.pushTemplate');
    CarPlay.pushTemplate(template, true);
    return () => {
      console.log('Details.popTemplate');
      CarPlay.popTemplate(true);
    };
  }, [item]);

  const onClose = useCallback(() => {
    setShowing(false);
  }, []);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details: {item.name}</Text>
      {showing ? (
        <DirectionDialog lat={item.lat} lon={item.lon} onClose={onClose} />
      ) : null}
    </View>
  );
};
