import { createIcon } from '@/utils/IconUtil';
import { MenuDataItem } from '@ant-design/pro-components';
import { request } from '@umijs/max';
import React, { lazy } from 'react';

type PageLoader = () => Promise<{ default: React.ComponentType<any> }>;

const pageLoaders: Record<string, PageLoader> = {
  'Monitor/Cache/index.tsx': () => import('@/pages/Monitor/Cache/index'),
  'Monitor/Cache/List.tsx': () => import('@/pages/Monitor/Cache/List'),
  'Monitor/Druid/index.tsx': () => import('@/pages/Monitor/Druid/index'),
  'Monitor/Job/detail.tsx': () => import('@/pages/Monitor/Job/detail'),
  'Monitor/Job/edit.tsx': () => import('@/pages/Monitor/Job/edit'),
  'Monitor/Job/index.tsx': () => import('@/pages/Monitor/Job/index'),
  'Monitor/JobLog/detail.tsx': () => import('@/pages/Monitor/JobLog/detail'),
  'Monitor/JobLog/index.tsx': () => import('@/pages/Monitor/JobLog/index'),
  'Monitor/Logininfor/edit.tsx': () => import('@/pages/Monitor/Logininfor/edit'),
  'Monitor/Logininfor/index.tsx': () => import('@/pages/Monitor/Logininfor/index'),
  'Monitor/Online/index.tsx': () => import('@/pages/Monitor/Online/index'),
  'Monitor/Operlog/detail.tsx': () => import('@/pages/Monitor/Operlog/detail'),
  'Monitor/Operlog/index.tsx': () => import('@/pages/Monitor/Operlog/index'),
  'Monitor/Server/index.tsx': () => import('@/pages/Monitor/Server/index'),
  'System/Config/edit.tsx': () => import('@/pages/System/Config/edit'),
  'System/Config/index.tsx': () => import('@/pages/System/Config/index'),
  'System/Dept/edit.tsx': () => import('@/pages/System/Dept/edit'),
  'System/Dept/index.tsx': () => import('@/pages/System/Dept/index'),
  'System/Dict/edit.tsx': () => import('@/pages/System/Dict/edit'),
  'System/Dict/index.tsx': () => import('@/pages/System/Dict/index'),
  'System/DictData/edit.tsx': () => import('@/pages/System/DictData/edit'),
  'System/DictData/index.tsx': () => import('@/pages/System/DictData/index'),
  'System/Logininfor/edit.tsx': () => import('@/pages/System/Logininfor/edit'),
  'System/Logininfor/index.tsx': () => import('@/pages/System/Logininfor/index'),
  'System/Menu/edit.tsx': () => import('@/pages/System/Menu/edit'),
  'System/Menu/index.tsx': () => import('@/pages/System/Menu/index'),
  'System/Notice/edit.tsx': () => import('@/pages/System/Notice/edit'),
  'System/Notice/index.tsx': () => import('@/pages/System/Notice/index'),
  'System/Operlog/detail.tsx': () => import('@/pages/System/Operlog/detail'),
  'System/Operlog/index.tsx': () => import('@/pages/System/Operlog/index'),
  'System/Post/edit.tsx': () => import('@/pages/System/Post/edit'),
  'System/Post/index.tsx': () => import('@/pages/System/Post/index'),
  'System/Role/authUser.tsx': () => import('@/pages/System/Role/authUser'),
  'System/Role/edit.tsx': () => import('@/pages/System/Role/edit'),
  'System/Role/index.tsx': () => import('@/pages/System/Role/index'),
  'System/User/edit.tsx': () => import('@/pages/System/User/edit'),
  'System/User/index.tsx': () => import('@/pages/System/User/index'),
  'Tool/Build/index.tsx': () => import('@/pages/Tool/Build/index'),
  'Tool/Gen/edit.tsx': () => import('@/pages/Tool/Gen/edit'),
  'Tool/Gen/import.tsx': () => import('@/pages/Tool/Gen/import'),
  'Tool/Gen/index.tsx': () => import('@/pages/Tool/Gen/index'),
  'Tool/Swagger/index.tsx': () => import('@/pages/Tool/Swagger/index'),
  'User/Center/index.tsx': () => import('@/pages/User/Center/index'),
  'User/Login/index.tsx': () => import('@/pages/User/Login/index'),
  'User/Settings/index.tsx': () => import('@/pages/User/Settings/index'),
  'Welcome.tsx': () => import('@/pages/Welcome'),
};

function getPageLoader(path: string): PageLoader {
  const loader = pageLoaders[path];
  if (!loader) {
    console.warn(`[router] Unknown remote menu component: ${path}`);
    return () => import('@/pages/404');
  }
  return loader;
}


let remoteMenu: any = null;

export function getRemoteMenu() {
  return remoteMenu;
}

export function setRemoteMenu(data: any) {
  remoteMenu = data;
}


function patchRouteItems(route: any, menu: any, parentPath: string) {
  for (const menuItem of menu) {
    if (menuItem.component === 'Layout' || menuItem.component === 'ParentView') {
      if (menuItem.routes) {
        let hasItem = false;
        let newItem = null;
        for (const routeChild of route.routes) {
          if (routeChild.path === menuItem.path) {
            hasItem = true;
            newItem = routeChild;
          }
        }
        if (!hasItem) {
          newItem = {
            path: menuItem.path,
            routes: [],
            children: []
          }
          route.routes.push(newItem)
        }
        patchRouteItems(newItem, menuItem.routes, parentPath + menuItem.path + '/');
      }
    } else {
      const names: string[] = menuItem.component.split('/');
      let path = '';
      names.forEach(name => {
        if (path.length > 0) {
          path += '/';
        }
        if (name !== 'index') {
          path += name.at(0)?.toUpperCase() + name.substr(1);
        } else {
          path += name;
        }
      })
      if (!path.endsWith('.tsx')) {
        path += '.tsx'
      }
      if (route.routes === undefined) {
        route.routes = [];
      }
      if (route.children === undefined) {
        route.children = [];
      }
      const newRoute = {
        element: React.createElement(lazy(getPageLoader(path))),
        path: parentPath + menuItem.path,
      }
      route.children.push(newRoute);
      route.routes.push(newRoute);
    }
  }
}

export function patchRouteWithRemoteMenus(routes: any) {
  if (remoteMenu === null) { return; }
  let proLayout = null;
  for (const routeItem of routes) {
    if (routeItem.id === 'ant-design-pro-layout') {
      proLayout = routeItem;
      break;
    }
  }
  patchRouteItems(proLayout, remoteMenu, '');
}

/** 获取当前的用户 GET /api/getUserInfo */
export async function getUserInfo(options?: Record<string, any>) {
  return request<API.UserInfoResult>('/api/getInfo', {
    method: 'GET',
    ...(options || {}),
  });
}

// 刷新方法
export async function refreshToken() {
  return request('/api/auth/refresh', {
    method: 'post'
  })
}

export async function getRouters(): Promise<any> {
  return request('/api/getRouters');
}

export function convertCompatRouters(childrens: API.RoutersMenuItem[]): any[] {
  return childrens.map((item: API.RoutersMenuItem) => {
    return {
      path: item.path,
      icon: createIcon(item.meta.icon),
      //  icon: item.meta.icon,
      name: item.meta.title,
      routes: item.children ? convertCompatRouters(item.children) : undefined,
      hideChildrenInMenu: item.hidden,
      hideInMenu: item.hidden,
      component: item.component,
      authority: item.perms,
    };
  });
}

export async function getRoutersInfo(): Promise<MenuDataItem[]> {
  return getRouters().then((res) => {
    if (res.code === 200) {
      return convertCompatRouters(res.data);
    } else {
      return [];
    }
  });
}

export function getMatchMenuItem(
  path: string,
  menuData: MenuDataItem[] | undefined,
): MenuDataItem[] {
  if (!menuData) return [];
  let items: MenuDataItem[] = [];
  menuData.forEach((item) => {
    if (item.path) {
      if (item.path === path) {
        items.push(item);
        return;
      }
      if (path.length >= item.path?.length) {
        const exp = `${item.path}/*`;
        if (path.match(exp)) {
          if (item.routes) {
            const subpath = path.substr(item.path.length + 1);
            const subItem: MenuDataItem[] = getMatchMenuItem(subpath, item.routes);
            items = items.concat(subItem);
          } else {
            const paths = path.split('/');
            if (paths.length >= 2 && paths[0] === item.path && paths[1] === 'index') {
              items.push(item);
            }
          }
        }
      }
    }
  });
  return items;
}
