export type BukIconType =
  | 0 // 空車
  | 1 // 混雑
  | 2 // 満車
  | 3
  | 4; // 不明

export interface BukItem {
  no: string;
  name: string;
  icon: BukIconType;
  num: number;
  lat: number;
  lon: number;
}

export function getStatus(icon: BukIconType): string {
  switch (icon) {
    case 0:
      return '空車';
    case 1:
      return '混雑';
    case 2:
      return '満車';
    default:
      return '不明';
  }
}

export function getStatusImage(icon: BukIconType) {
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
