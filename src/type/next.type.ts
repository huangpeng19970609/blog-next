/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-28 23:26:30
 * @description: 这是一个用于next的ts声明
 */

import { NextPage } from "next";
import { AppProps } from "next/app";
import { Dispatch, ReactElement, ReactNode, SetStateAction } from "react";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type { NextPageWithLayout, AppPropsWithLayout };
