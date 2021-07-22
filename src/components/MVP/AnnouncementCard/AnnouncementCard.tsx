import React from 'react'
import Link from 'next/link'
import { Card, CardBody, CardFooter, Tag } from '@trussworks/react-uswds'
import { ColumnSizes } from '@trussworks/react-uswds/lib/components/grid/types'
import styles from './AnnouncementCard.module.scss'

export interface AnnouncementCardProps {
  body?: string
  bgColor: string
  cols: ColumnSizes
  heading: string
  path: string
  tag: string
}

const AnnouncementCard = ({
  body,
  bgColor,
  cols,
  heading,
  path,
  tag,
}: AnnouncementCardProps) => {
  return (
    <Card
      className={`${styles.card}`}
      containerProps={{
        className: bgColor,
      }}
      gridLayout={{ tablet: { col: cols } }}>
      <Link href={path}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className={`${styles.cardLink}`}>
          <CardBody>
            <h3 className="usa-card__heading text-white">{heading}</h3>
            {body && <p className="text-white">{body}</p>}
          </CardBody>

          <CardFooter>
            <Tag className={`text-ink tag--${tag}`}>{tag}</Tag>
          </CardFooter>
        </a>
      </Link>
    </Card>
  )
}

export default AnnouncementCard