import { useState, useEffect } from 'react'
import { InferGetStaticPropsType } from 'next'
import { Button, Grid } from '@trussworks/react-uswds'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import { useRouter } from 'next/router'

import { lists } from '.keystone/api'

import type {
  BookmarkRecords,
  CollectionRecords,
  Collection as CollectionType,
} from 'types/index'
import { withBetaLayout } from 'layout/Beta/DefaultLayout/DefaultLayout'
import Collection from 'components/Collection/Collection'
import Bookmark from 'components/Bookmark/Bookmark'
import BookmarkList from 'components/BookmarkList/BookmarkList'
import SelectableCollection from 'components/SelectableCollection/SelectableCollection'
import styles from 'styles/pages/sitesAndApplications.module.scss'
import { useAddCollectionsMutation } from 'operations/mutations/addCollections'

type SortBy = 'SORT_TYPE' | 'SORT_ALPHA'

type SelectedCollections = string[]

const SitesAndApplications = ({
  collections,
  bookmarks,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()
  const [sortBy, setSort] = useState<SortBy>('SORT_TYPE')
  const [selectMode, setSelectMode] = useState<boolean>(
    router.query.selectMode == 'true' || false
  )
  const [selectedCollections, setSelectedCollections] =
    useState<SelectedCollections>([])
  const [handleAddCollections] = useAddCollectionsMutation()

  useEffect(() => {
    if (router.query.selectMode == 'true') {
      setSelectMode(true)
    }
  }, [router.query])

  const handleSortClick = (sortType: SortBy) => setSort(sortType)

  const handleToggleSelectMode = () => {
    setSelectMode((currentMode) => !currentMode)
    setSelectedCollections([])
  }

  const widgetClasses = classnames(styles.widgetContainer, {
    [styles.selectMode]: selectMode,
  })

  const handleSelectCollection = (id: string): void => {
    if (isSelected(id)) {
      setSelectedCollections((state) => {
        const itemIndex = state.indexOf(id)
        const newState = [...state]
        newState.splice(itemIndex, 1)
        return newState
      })
    } else {
      setSelectedCollections((state) => [...state, id])
    }
  }

  const isSelected = (id: string): boolean =>
    selectedCollections.indexOf(id) > -1

  const handleAddSelected = () => {
    const collectionObjs = selectedCollections.map((id) =>
      collections.find((i) => i.id === id)
    ) as CollectionType[]

    handleAddCollections({
      variables: {
        collections: collectionObjs,
      },
    })
    setSelectMode(false)
    setSelectedCollections([])
    router.push('/')
  }

  return (
    <>
      <h2 className={styles.pageTitle}>Sites &amp; Applications</h2>

      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.sortButton}
          disabled={sortBy === 'SORT_ALPHA' || selectMode}
          onClick={() => handleSortClick('SORT_ALPHA')}>
          <FontAwesomeIcon icon="list" /> Sort alphabetically
        </button>
        <button
          type="button"
          className={styles.sortButton}
          disabled={sortBy === 'SORT_TYPE'}
          onClick={() => handleSortClick('SORT_TYPE')}>
          <FontAwesomeIcon icon="th-large" />
          Sort by type
        </button>
      </div>

      {sortBy === 'SORT_ALPHA' && <BookmarkList bookmarks={bookmarks} />}

      {sortBy === 'SORT_TYPE' && (
        <div className={widgetClasses}>
          <div className={styles.widgetToolbar}>
            {selectMode ? (
              <>
                <span>
                  {selectedCollections.length} collection
                  {selectedCollections.length !== 1 && 's'} selected
                </span>
                <Button
                  type="button"
                  accentStyle="warm"
                  inverse
                  disabled={selectedCollections.length < 1}
                  onClick={handleAddSelected}>
                  Add selected
                </Button>
                <Button type="button" outline onClick={handleToggleSelectMode}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button type="button" onClick={handleToggleSelectMode}>
                Select multiple collections
              </Button>
            )}
          </div>

          <Grid row gap className={styles.widgets}>
            {collections.map((collection) => {
              return (
                <Grid
                  key={`collection_${collection.id}`}
                  tablet={{ col: 6 }}
                  desktop={{ col: 3 }}>
                  {selectMode ? (
                    <SelectableCollection
                      id={collection.id}
                      title={collection.title}
                      bookmarks={collection.bookmarks}
                      isSelected={isSelected(collection.id)}
                      onSelect={() => handleSelectCollection(collection.id)}
                    />
                  ) : (
                    <Collection title={collection.title}>
                      {collection.bookmarks?.map((bookmark) => (
                        <Bookmark
                          key={`bookmark_${bookmark.id}`}
                          href={bookmark.url}>
                          {bookmark.label}
                        </Bookmark>
                      ))}
                    </Collection>
                  )}
                </Grid>
              )
            })}
          </Grid>
        </div>
      )}
    </>
  )
}

export default SitesAndApplications

SitesAndApplications.getLayout = withBetaLayout

export async function getStaticProps() {
  const collections: CollectionRecords = (await lists.Collection.findMany({
    query: 'id title bookmarks { id url label }',
  })) as CollectionRecords

  const bookmarks: BookmarkRecords = (await lists.Bookmark.findMany({
    query: 'id url label description',
    orderBy: [{ label: 'asc' }],
  })) as BookmarkRecords

  return { props: { collections, bookmarks } }
}
