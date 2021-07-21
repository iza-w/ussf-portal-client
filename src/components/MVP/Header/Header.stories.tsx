import React from 'react'
import { Meta } from '@storybook/react'
import { withNextRouter } from 'storybook-addon-next-router'

import Header from './Header'
import styles from './Header.module.scss'

export default {
  title: 'Components/Header',
  component: Header,
  decorators: [
    withNextRouter,
    (Story) => (
      <div className={styles.navContainer}>
        <Story />
      </div>
    ),
  ],
} as Meta

export const HeaderOnHomePage = () => <Header />

HeaderOnHomePage.story = {
  parameters: {
    nextRouter: {
      pathname: '/',
      asPath: '/',
    },
  },
}

export const HeaderOnNewsPage = () => <Header />

HeaderOnNewsPage.story = {
  parameters: {
    nextRouter: {
      pathname: '/news',
      asPath: '/news',
    },
  },
}