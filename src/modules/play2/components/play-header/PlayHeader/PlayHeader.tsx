import { AnimatePresence, motion } from "framer-motion";
import { CrownIcon } from "../../../../../assets/icons/CrownIcon";
import { toHumanReadableTime } from "../../../../../common/utils/toHumanReadableTime";
import cpmToWpm from "../../../../../utils/cpmToWpm";
import {
  RacePlayer,
  RaceResult,
  useGameStore,
  useIsMultiplayer,
} from "../../../state/game-store";

import { createUseStyles } from "react-jss";

import mario from "../../../../../assets/icons/mario.png";
import luigi from "../../../../../assets/icons/luigi.png";

type RuleNames = 'marioImage' | 'road' | 'lines'

type ProgressBarProps2 = {
  value: number
  showLabel?: boolean
  style?: React.CSSProperties
}


interface SpectatorProps {
  spectator: boolean
}


const useStyles = createUseStyles<RuleNames, Omit<ProgressBarProps2, 'style'>>({
  marioImage: ({ theme, value }) => ({
    position: 'relative',
    transition: 'translate 0.2s ease',
    // translate: `(${value}) % `,
    width: 35,
    height: 35,
    top: -12,
    bottom: 0,
    // left: (value + "%"),
    right: 0,
    marginLeft: 12,
    marginTop: 12,
    marginRight: 12,
    zIndex: 2,
  }),
  road: ({ theme }) => ({
    position: 'relative',
    width: '100%',
    height: '50px',
    // top: 0,
    // left: 0,
    // right: 0,
    background: 'dimgray',
    borderTop: '5px solid grey',
    borderBottom: '5px solid grey',
    boxSizing: 'border-box',
    marginTop: 12,
    marginBottom: 12,
    zIndex: 0,
    display: 'flex',
    alignItems: 'center',
  }),
  'lines': ({ theme }) => ({
    boxSizing: 'border-box',
    border: '2px dashed white',
    height: '0px',
    width: '100%',
    position: 'relative',
    top: '-200',
    zIndex: 3

  }),
})









export function ResultsContainer({ spectator = false }) {
  const isMultiplayer = true; //useIsMultiplayer();
  const results = useGameStore((state) => state.results);
  return isMultiplayer ? (
    <div className="my-1">
      {Object.values(results).map((result, i) => {
        const place = i + 1;
        return <Result key={i} result={result} place={place} spectator={spectator} />;
      })}
    </div>
  ) : null;
}

export function ProgressContainer() {
  const isMultiplayer = true;
  const members = useGameStore((state) => state.members);
  return isMultiplayer ? (
    <div className="my-2" style={{
      width: '100%'
    }}>
      {Object.values(members).map((player, index) => {
        return <ProgressBar key={player.id} player={player} playerIndex={index + 1} />;
      })}
    </div>
  ) : null;
}

interface ResultProps {
  result: RaceResult;
  place: number;
  spectator: boolean,
}

export function Result({ result, place, spectator = false }: ResultProps) {

  if (spectator) {
    return (
      <div>
        <div className="flex row w-full items-center rounded-md px-3 py-3 my-2" style={{
          outline: '4px dashed #381B24',
          background: '#ffc55e'
        }}>
          <span className="flex w-48 ml-1 mr-4 text-med font-bold truncate text-dark-ocean">
            {result.user.username}
          </span>
          <div className="flex w-full gap-2">
            <span className="flex font-semibold text-xs rounded-lg px-2 py-1 bg-orange-900 text-white">
              {place} place
            </span>
            <div className="flex flex-grow justify-end gap-2">
              <span className="font-semibold text-xs rounded-lg px-2 py-1 bg-gray-700">
                {cpmToWpm(result.cpm)} wpm
              </span>
              <span className="font-semibold text-xs rounded-lg px-2 py-1 bg-gray-700">
                {result.accuracy}% accuracy
              </span>
              <span className="font-semibold text-xs rounded-lg px-2 py-1 bg-gray-700">
                {toHumanReadableTime(Math.floor(result.timeMS / 1000))}
              </span>
              <span className="font-semibold text-xs rounded-lg px-2 py-1 bg-gray-700">
                {result.mistakes} mistakes
              </span>
            </div>
          </div>
        </div>

        {spectator && (
          <div style={{height: '.1rem'}}/>
        )}
      </div>
    );
  }
  return (
    <div className="flex row w-full items-center bg-dark-lake rounded-lg px-3 py-2 my-2">
      <span className="flex w-48 ml-1 mr-4 text-sm font-semibold truncate">
        {result.user.username}
      </span>
      <div className="flex w-full gap-2">
        <span className="flex font-semibold text-xs rounded-lg px-2 py-1 bg-purple-300 text-dark-ocean">
          {place} place
        </span>
        <div className="flex flex-grow justify-end gap-2">
          <span className="font-semibold text-xs rounded-lg px-2 py-1 bg-gray-700">
            {cpmToWpm(result.cpm)} wpm
          </span>
          <span className="font-semibold text-xs rounded-lg px-2 py-1 bg-gray-700">
            {result.accuracy}% accuracy
          </span>
          <span className="font-semibold text-xs rounded-lg px-2 py-1 bg-gray-700">
            {toHumanReadableTime(Math.floor(result.timeMS / 1000))}
          </span>
          <span className="font-semibold text-xs rounded-lg px-2 py-1 bg-gray-700">
            {result.mistakes} mistakes
          </span>
        </div>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  player: RacePlayer;
  playerIndex: number,
}

interface ProgressProps {
  progress: Number;
  word: string;
}

export function Progress({ progress, word }: ProgressProps) {
  return (
    <div
      className="w-full bg-white rounded-lg flex items-center"
      style={{
        height: "4px",
      }}
    >
      <div
        className="bg-purple-300 h-full rounded-lg"
        style={{ width: `${progress}%`, transition: "width 200ms ease-in-out" }}
      ></div>
      {word && (
        <span className="font-semibold text-xs rounded-lg px-2 py-1 bg-gray-700">
          {word}
        </span>
      )}
    </div>
  );
}

export function ProgressBar({ player, playerIndex}: ProgressBarProps) {
  const ownerId = useGameStore.getState().owner;
  const isOwner = ownerId === player.id;
  const isCompleted = player.progress === 100;
  const classes = useStyles({ value: player.progress })
  const word = player.username;
  const progress = player.progress;

  if (true) {

    return !isCompleted ? (
      <div className="flex row w-full items-center bg-dark-lake rounded-lg px-3 py-2 my-2" style={{
        height: "3.6rem"
      }}>
        <div style={{
          height: "3.3rem",
          width: '100%',
          left: 0,
          background: 'dimgray',
          borderTop: '5px solid grey',
          borderBottom: '5px solid grey',
          boxSizing: 'border-box',
          zIndex: 0,
          position: "absolute",
          display: 'flex',
          alignItems: 'center',
        }}>

          <div style={{
            boxSizing: 'border-box',
            border: '2px dashed white',
            height: '0px',
            width: '100%',
            // top: '-200',
          }}>

          </div>

        </div>



        <div
          className="w-full bg-transparent rounded-lg flex items-center"
          style={{
            height: "4px",
            zIndex: 3
          }}
        >
          <div
            className="bg-transparent h-full rounded-lg"
            style={{ width: `${progress}%`, transition: "width 200ms ease-in-out", zIndex: 0 }}
          ></div>

          <img src={(playerIndex & 1) ? mario.src : luigi.src}
            className={classes.marioImage} />





          {word && (
            <div className="rounded-lg px-2 py-1 bg-gray-700" style={{
              display: 'flex',
              flexDirection: 'row',
            }
            }>
              {isOwner && (
                <div style={{ marginRight: '.5rem' }}>
                  <CrownIcon></CrownIcon>
                </div>
              )}



              <span className="font-semibold text-xs">
                {word}
              </span>
            </div>
          )}





        </div>




        {/* <div className={classes.road}>
          <div className={classes.lines}></div>
        </div> */}

      </div>
    ) : null;
  }

  return !isCompleted ? (
    <div className="flex row w-full items-center bg-dark-lake rounded-lg px-3 py-2 my-2">
      <span className="flex w-48 ml-1 mr-4 text-sm font-semibold truncate">
        {player.username}
        {isOwner ? (
          <div className="ml-1">
            <CrownIcon />
          </div>
        ) : null}
      </span>
      <Progress progress={player.progress} word={player.recentlyTypedLiteral} />
    </div>
  ) : null;
}

export function PlayHeader({ spectator = false }: SpectatorProps) {
  return (
    <div className="w-full relative">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <ResultsContainer spectator={spectator}></ResultsContainer>
          <ProgressContainer />

          <div style={{ height: '1rem' }}></div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
