import axios from 'axios';

const url = 'https://corona.lmao.ninja/v2';

export const fetchData = async (country) => {
  try {
    let customUrl = !country ? `${url}/all` : `${url}/countries`;
    if (!country) {
      const { data: { cases, active, recovered, deaths, updated, todayCases, todayDeaths } } = await axios.get(customUrl);
      return { cases, active, recovered, deaths, updated, todayCases, todayDeaths };
    }
    const countries = await axios.get(customUrl);
    const { cases, active, recovered, deaths, updated, todayCases, todayDeaths } = countries.data.find(countryData => { return countryData.country === country })
    return { cases, active, recovered, deaths, updated, todayCases, todayDeaths };
  } catch (error) {
    return error;
  }
};

export const fetchDailyData = async () => {
  try {
    const response = await axios.get(`${url}/daily`);
    return response.data.map(({ confirmed, deaths, reportDate: date }) => ({ confirmed: confirmed.total, deaths: deaths.total, date }));
  } catch (error) {
    return error;
  }
};

export const fetchCountries = async () => {
  try {
    const { data: allCountryData } = await axios.get(`${url}/countries`);
    allCountryData.sort((a, b) => {
      return b.cases - a.cases
    })
    return allCountryData;
  } catch (error) {
    return error;
  }
};

export const fetchCountryList = async () => {
  try {
    const { data: allCountryData } = await axios.get(`${url}/countries`);
    return allCountryData.map((countryData) => countryData.country);
  } catch (error) {
    return error;
  }
};