import { InferGetStaticPropsType } from 'next'
import { Grid } from '@trussworks/react-uswds'

import { lists } from '.keystone/api'

import { withBetaLayout } from 'layout/Beta/DefaultLayout/DefaultLayout'
import Collection from 'components/Collection/Collection'
import Bookmark from 'components/Bookmark/Bookmark'
import styles from 'styles/pages/sitesAndApplications.module.scss'

type Bookmark = {
  id: string
  url: string
  label?: string
  description?: string
}

const SitesAndApplications = ({
  collections,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <h2 className={styles.pageTitle}>Sites &amp; Applications</h2>

      <div className={styles.widgetContainer}>
        <Grid row gap>
          {collections.map((collection) => (
            <Grid
              key={`collection_${collection.id}`}
              tablet={{ col: 6 }}
              desktop={{ col: 3 }}>
              <Collection title={collection.title}>
                {collection.bookmarks.map((bookmark: Bookmark) => (
                  <Bookmark key={`bookmark_${bookmark.id}`} href={bookmark.url}>
                    {bookmark.label}
                  </Bookmark>
                ))}
              </Collection>
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  )
}

export default SitesAndApplications

SitesAndApplications.getLayout = withBetaLayout

export async function getStaticProps() {
  const collections = await lists.Collection.findMany({
    query: 'id title bookmarks { id url label }',
  })

  return { props: { collections } }
}