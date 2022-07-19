'use strict';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import countryHbs from './templates/country.hbs';
import countryListsHbs from './templates/country-list.hbs';
const inputEl = document.querySelector('[id=search-box]');
const manyCountries = document.querySelector('.country-list');
const oneCountry = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

const onSearthCountry = event => {
  let searchCountry = inputEl.value.trim();
  if (searchCountry.length === 0) {
    oneCountry.remove();
    manyCountries.remove();
    return;
  }
  fetchCountries(searchCountry)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length > 2 && data.length < 10) {
        manyCountries.innerHTML = countryListsHbs(data);
      } else if (data.length === 1) {
        manyCountries.remove();
        const country = data[0];
        country.languages = Object.values(country.languages).join(',');
        oneCountry.innerHTML = countryHbs(country);
      }
    })

    .catch(err => {
      if (err.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    });
};

inputEl.addEventListener('input', debounce(onSearthCountry, DEBOUNCE_DELAY));
