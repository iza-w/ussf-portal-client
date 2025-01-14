import React from 'react'
import classnames from 'classnames'
import styles from './Search.module.scss'
import LinkTo from 'components/util/LinkTo/LinkTo'

const Search = ({ disabled }: { disabled?: boolean }) => {
  const disableClass = classnames({
    [styles.disabled]: disabled,
  })

  return (
    <div className={styles.search}>
      {disabled && (
        <div className={styles.comingSoon}>
          <h4>Search coming soon!</h4>
        </div>
      )}

      <div className={disableClass}>
        <form className="usa-search usa-search--big" role="search">
          <label className="usa-sr-only" htmlFor="options">
            Search Options
          </label>
          <select
            className="usa-select usa-button"
            name="options"
            id="options"
            disabled={disabled}>
            <option value="all">All</option>
            <option value="value1">Option 1</option>
            <option value="value2">Option 2</option>
            <option value="value3">Option 3</option>
          </select>

          <label className="usa-sr-only" htmlFor="search-field-en-big">
            Search
          </label>
          <input
            className="usa-input"
            id="search-field-en-big"
            type="search"
            name="search"
            placeholder="What are you looking for today?"
            disabled={disabled}
          />

          <button className="usa-button" type="submit" disabled={disabled}>
            <span className="usa-search__submit-text">Search</span>
          </button>
        </form>
        <div className={styles.suggestedTerms}>
          <h3>Are you looking for:</h3>
          <ul>
            <li>
              <LinkTo href="/" tabIndex={-1}>
                PT Tests
              </LinkTo>
              ,
            </li>
            <li>
              <LinkTo href="/" tabIndex={-1}>
                TRICARE
              </LinkTo>
              ,
            </li>
            <li>
              <LinkTo href="/" tabIndex={-1}>
                MyPay
              </LinkTo>
              ,
            </li>
            <li>
              <LinkTo href="/" tabIndex={-1}>
                Leaveweb
              </LinkTo>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Search
