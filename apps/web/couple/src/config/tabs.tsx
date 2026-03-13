import { IoBookOutline, IoChatbubblesOutline, IoPersonOutline } from 'react-icons/io5';
import type { NavTab } from '@we/ui-web';

export const tabs: NavTab[] = [
  { key: 'diary',     path: '/diary',     label: '일기장',  icon: <IoBookOutline size={22} /> },
  { key: 'community', path: '/community', label: '커뮤니티', icon: <IoChatbubblesOutline size={22} /> },
  { key: 'my-info',   path: '/my-info',   label: '내 정보', icon: <IoPersonOutline size={22} /> },
];
