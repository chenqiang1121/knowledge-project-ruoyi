import {
  ApiOutlined,
  ApartmentOutlined,
  AppstoreOutlined,
  AuditOutlined,
  BarChartOutlined,
  BellOutlined,
  BookOutlined,
  BranchesOutlined,
  BugOutlined,
  BuildOutlined,
  CloudOutlined,
  ClusterOutlined,
  CodeOutlined,
  ControlOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  DeploymentUnitOutlined,
  DesktopOutlined,
  EditOutlined,
  FileOutlined,
  FileSearchOutlined,
  FolderOutlined,
  FormOutlined,
  FundOutlined,
  GlobalOutlined,
  HddOutlined,
  HistoryOutlined,
  HomeOutlined,
  IdcardOutlined,
  KeyOutlined,
  LineChartOutlined,
  LockOutlined,
  MenuOutlined,
  MonitorOutlined,
  NotificationOutlined,
  OrderedListOutlined,
  PartitionOutlined,
  PieChartOutlined,
  ProfileOutlined,
  QuestionOutlined,
  ReadOutlined,
  SafetyOutlined,
  ScheduleOutlined,
  SearchOutlined,
  SettingOutlined,
  SlidersOutlined,
  SolutionOutlined,
  TableOutlined,
  TagsOutlined,
  TeamOutlined,
  ToolOutlined,
  UnlockOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React from 'react';

type IconComponent = React.ComponentType<Record<string, never>>;

const menuIcons: Record<string, IconComponent> = {
  ApiOutlined,
  ApartmentOutlined,
  AppstoreOutlined,
  AuditOutlined,
  BarChartOutlined,
  BellOutlined,
  BookOutlined,
  BranchesOutlined,
  BugOutlined,
  BuildOutlined,
  CloudOutlined,
  ClusterOutlined,
  CodeOutlined,
  ControlOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  DeploymentUnitOutlined,
  DesktopOutlined,
  EditOutlined,
  FileOutlined,
  FileSearchOutlined,
  FolderOutlined,
  FormOutlined,
  FundOutlined,
  GlobalOutlined,
  HddOutlined,
  HistoryOutlined,
  HomeOutlined,
  IdcardOutlined,
  KeyOutlined,
  LineChartOutlined,
  LockOutlined,
  MenuOutlined,
  MonitorOutlined,
  NotificationOutlined,
  OrderedListOutlined,
  PartitionOutlined,
  PieChartOutlined,
  ProfileOutlined,
  QuestionOutlined,
  ReadOutlined,
  SafetyOutlined,
  ScheduleOutlined,
  SearchOutlined,
  SettingOutlined,
  SlidersOutlined,
  SolutionOutlined,
  TableOutlined,
  TagsOutlined,
  TeamOutlined,
  ToolOutlined,
  UnlockOutlined,
  UnorderedListOutlined,
  UserOutlined,
};

const iconAliases: Record<string, string> = {
  account: 'UserOutlined',
  cache: 'HddOutlined',
  chart: 'BarChartOutlined',
  component: 'AppstoreOutlined',
  config: 'SettingOutlined',
  dashboard: 'DashboardOutlined',
  data: 'DatabaseOutlined',
  database: 'DatabaseOutlined',
  dept: 'ApartmentOutlined',
  dict: 'BookOutlined',
  document: 'FileOutlined',
  edit: 'EditOutlined',
  form: 'FormOutlined',
  home: 'HomeOutlined',
  job: 'ScheduleOutlined',
  list: 'UnorderedListOutlined',
  log: 'FileSearchOutlined',
  logininfor: 'HistoryOutlined',
  menu: 'MenuOutlined',
  monitor: 'MonitorOutlined',
  notice: 'NotificationOutlined',
  online: 'TeamOutlined',
  post: 'IdcardOutlined',
  role: 'SafetyOutlined',
  server: 'CloudOutlined',
  system: 'SettingOutlined',
  table: 'TableOutlined',
  tool: 'ToolOutlined',
  user: 'UserOutlined',
};

function normalizeIconName(name?: string): string {
  if (!name) {
    return '';
  }

  const trimmed = name.trim();
  if (menuIcons[trimmed]) {
    return trimmed;
  }

  const alias = iconAliases[trimmed.toLowerCase()];
  if (alias) {
    return alias;
  }

  const pascalName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return pascalName.endsWith('Outlined') ? pascalName : `${pascalName}Outlined`;
}

export function getIcon(name: string): IconComponent | string {
  return menuIcons[normalizeIconName(name)] || '';
}

export function createIcon(icon: string | React.ReactNode): React.ReactNode | string {
  if (typeof icon !== 'string') {
    return icon;
  }

  const IconComponent = getIcon(icon);
  return typeof IconComponent === 'string' ? '' : React.createElement(IconComponent);
}
