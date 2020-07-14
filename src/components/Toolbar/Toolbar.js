import React from "react";

import Roller from "@dvdagames/js-die-roller";

import Store from "../../utilities/storage";

import checkVersion from "../../utilities/check-version";

import {
  RUN_ENGINE_ROLL,
  RANDOM_HEX_ROLL,
  ACTIONS,
  LOCAL_STORAGE_ENGINE_KEY,
  DEFAULT_ENGINE_STORE,
} from "../../constants";

import styles from "./Toolbar.module.scss";

export const Toolbar = ({
  setRoll,
  engines,
  currentEngine,
  setCurrentEngine,
  setActiveHex,
  showAnnotations,
  setShowAnnotations,
}) => {
  const runEngine = () => {
    if (typeof setRoll === "function") {
      try {
        const {
          result: { total },
        } = new Roller(RUN_ENGINE_ROLL);

        const type = ACTIONS.RUN;

        setRoll({ type, total });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const randomHex = () => {
    if (typeof setRoll === "function") {
      try {
        const {
          result: {
            total: [total],
          },
        } = new Roller(RANDOM_HEX_ROLL);

        const type = ACTIONS.RANDOM;

        setRoll({ type, total });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const renderEngineOptions = () => {
    return engines.map(({ id, name }) => {
      return (
        <option key={`engine-${id}`} value={id}>
          {name}
        </option>
      );
    });
  };

  const restartEngine = () => {
    setActiveHex(currentEngine.start);
  };

  const onChooseEngine = (e) => {
    const engineId = e.target.value;

    const engineKey = `${LOCAL_STORAGE_ENGINE_KEY}_${engineId}`;

    const storedEngine = engines.find(({ id }) => id === engineId);

    const cachedEngine = Store.get(engineKey);

    if (checkVersion(storedEngine.version, cachedEngine.version)) {
      const newEngine = {
        ...DEFAULT_ENGINE_STORE.find(({ id }) => id === engineId),
        active: cachedEngine?.active ? cachedEngine.active : storedEngine.start,
      };

      Store.set(engineKey, newEngine);

      setCurrentEngine(newEngine);
    }

    if (storedEngine?.id) {
      setCurrentEngine(storedEngine);
    }
  };

  const onChangeAnnotations = (e) => {
    e.persist();

    console.log(e);

    setShowAnnotations(e.target.checked);
  };

  return (
    <nav className={styles.toolbar}>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <button onClick={runEngine}>Run Engine (2d6)</button>
        </li>
        <li className={styles.listItem}>
          <button onClick={randomHex}>Random (1d19)</button>
        </li>
        <li className={styles.listItem}>
          <button onClick={restartEngine}>Restart</button>
        </li>
        <li className={styles.listItem}>
          <label htmlFor="choose-engine">Engine</label>
          <select
            id="choose-engine"
            onChange={onChooseEngine}
            disabled={engines.length < 2}
            value={currentEngine.id}
          >
            {renderEngineOptions()}
          </select>
        </li>
        <li className={styles.listItem}>
          <label htmlFor="show-annotations">Show Roll Map</label>
          <input
            type="checkbox"
            value={1}
            checked={showAnnotations}
            onChange={onChangeAnnotations}
          />
        </li>
      </ul>
    </nav>
  );
};
