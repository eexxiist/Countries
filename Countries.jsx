import React, { useState, useEffect } from "react";
import Styles from "./style.module.css";

export const Countries = () => {
    const [countryList, setCountryList] = useState([]);
    const [chooseCountry, setChooseCountry] = useState(null);
    const [neighbors, setNeighbors] = useState([]);
    const [neighborsData, setNeighborsData] = useState([]);

    useEffect(() => {
        const getList = async () => {
            try {
                const list = await fetch(
                    "https://restcountries.com/v3.1/all?fields=cca3,name,capital,region,population,flags,borders"
                );
                let countries = await list.json();
                setCountryList(countries);
            } catch (error) {
                console.log("Error");
            }
        };

        getList();
    }, []);

    const getCountryInfo = (countryItem) => {
        setChooseCountry(countryItem);
        setNeighborsData([]);
    };

    const getNeighbors = async () => {
        setNeighborsData([]);
        const borders = chooseCountry.borders;
        setNeighbors(borders);
        const neighborsArr = [];

        for (let i = 0; i < neighbors.length; i++) {
            const linkCountry = `https://restcountries.com/v3.1/alpha/${borders[i]}`;
            neighborsArr.push(fetch(linkCountry));
        }
        const response = await Promise.all(neighborsArr);
        const data = await Promise.all(response.map((el) => el.json()));
        setNeighborsData(data.map((c) => c[0]));
    };

    return (
        <div className={Styles.container}>
            <ul className={Styles.countries_list}>
                {countryList.map((countryItem) => (
                    <li
                        key={countryItem.cca3}
                        onClick={() => getCountryInfo(countryItem)}
                        className={Styles.country_item}
                    >
                        {countryItem.name?.common}
                    </li>
                ))}
            </ul>

            {chooseCountry && (
                <div className={Styles.country_info}>
                    <span>Столица: {chooseCountry.capital}</span>
                    <span>Население: {chooseCountry.population}</span>
                    <span>Регион: {chooseCountry.region}</span>
                    <img
                        src={chooseCountry.flags.png}
                        alt=""
                        className={Styles.country_flag}
                    />
                    <button
                        onClick={getNeighbors}
                        className={Styles.show_neighbors_btn}
                    >
                        Показать соседей
                    </button>
                </div>
            )}

            {neighborsData.length > 0 && (
                <div className={Styles.neighbors_list}>
                    {neighborsData.map((neighbor) => (
                        <div
                            key={neighbor.cca3}
                            className={Styles.neighbor_card}
                        >
                            <img
                                src={neighbor.flags.png}
                                alt=""
                                className={Styles.neighbor_flag}
                            />
                            <span className={Styles.neighbor_name}>
                                {neighbor.name.common}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
