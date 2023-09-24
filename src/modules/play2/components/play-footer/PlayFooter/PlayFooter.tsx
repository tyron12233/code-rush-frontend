import { faPerson, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { ButtonHTMLAttributes } from "react";
import { PlayIcon } from "../../../../../assets/icons";
import { InfoIcon } from "../../../../../assets/icons/InfoIcon";
import { LinkIcon } from "../../../../../assets/icons/LinkIcon";
import { ReloadIcon } from "../../../../../assets/icons/ReloadIcon";
import { WarningIcon } from "../../../../../assets/icons/WarningIcon";
// import { GithubLoginOverlay } from "../../../../../common/components/overlays/GithubLoginOverlay";
import { useIsPlaying } from "../../../../../common/hooks/useIsPlaying";
import { useUserStore } from "../../../../../common/state/user-store";
// import { copyToClipboard } from "../../../../../common/utils/clipboard";
import { toHumanReadableTime } from "../../../../../common/utils/toHumanReadableTime";
import { Keys, useKeyMap } from "../../../../../hooks/useKeyMap";
import useTotalSeconds from "../../../../../hooks/useTotalSeconds";
import { ChallengeInfo } from "../../../hooks/useChallenge";
import { useCodeStore } from "../../../state/code-store";
import { useConnectionStore } from "../../../state/connection-store";
import {
  useGameStore,
  useIsMultiplayer,
  useIsOwner,
} from "../../../state/game-store";
import {
  closeModals,
  openProfileModal,
  useHasOpenModal,
  useSettingsStore,
} from "../../../state/settings-store";
// import { RaceSettings } from "../../RaceSettings";
import { ChallengeSource } from "../ChallengeSource";
import { copyToClipboard } from "@/common/utils/clipboard";

interface PlayFooterProps {
  challenge: ChallengeInfo;
}

function useCodeStoreTotalSeconds() {
  // TODO: move useTotalSeconds to modules folder
  const startTime = useCodeStore((state) => state.startTime);
  const endTime = useCodeStore((state) => state.endTime);
  const totalSeconds = useTotalSeconds(
    startTime?.getTime(),
    endTime?.getTime()
  );
  return totalSeconds;
}

function useMistakeWarningMessage() {
  const currentMistakeCount = useCodeStore((state) => state.incorrectChars)()
    .length;
  return currentMistakeCount > 10;
}

export function WarningContainer() {
  const mistakesWarning = useMistakeWarningMessage();
  const isConnected = useConnectionStore((state) => state.isConnected);
  const raceExistsInServer = useConnectionStore(
    (state) => state.raceExistsInServer
  );
  const alreadyPlaying = useConnectionStore((state) => state.alreadyPlaying);
  const showRaceDoesNotExistWarning = !raceExistsInServer && !alreadyPlaying;
  const showDisconnectedWarning = !alreadyPlaying && !isConnected;
  return (
    <>
      {mistakesWarning && (
        <span className="flex ml-2 text-red-400 font-medium gap-1">
          <WarningIcon />
          Undo mistakes to continue
        </span>
      )}
      {showDisconnectedWarning && (
        <span className="flex ml-2 text-red-400 font-medium gap-1">
          <WarningIcon />
          You are not connected to the server.
        </span>
      )}
      {alreadyPlaying && (
        <span className="flex ml-2 text-red-400 font-medium gap-1">
          <WarningIcon />
          You can not play in two browsers simultaneously
        </span>
      )}
      {showRaceDoesNotExistWarning && (
        <h2 className="text-red-400 flex justify-center items-center ml-2 text-lg font-medium gap-1 my-2">
          <WarningIcon />
          This race does not exist. Refresh to continue.
          <i
            className="text-off-white h-4"
            title="When the server restarts current race state is resets"
          >
            <InfoIcon />
          </i>
        </h2>
      )}
    </>
  );
}

export function PlayFooter({ challenge }: PlayFooterProps) {
  const isPlaying = useIsPlaying();
  const totalSeconds = useCodeStoreTotalSeconds();
  const isAnonymous = useUserStore((u) => u.isAnonymous);
  const profileModalIsOpen = useSettingsStore((s) => s.profileModalIsOpen);
  return (
    <div className="w-full h-10 px-2">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          {!isPlaying && (
            <div className="w-full">
              <div className="flex row justify-between items-top">
                <ActionButtons />
                <div className="text-faded-gray flex gap-4">
                  {isAnonymous && (
                    <>
                      <button
                        onClick={openProfileModal}
                        className="flex text-xs items-center font-semibold tracking-wide hover:cursor-pointer gap-2 hover:text-off-white"
                      >
                        <div className="h-4 w-4 flex items-center">
                          <FontAwesomeIcon icon={faUserGroup} size="xs" />
                        </div>
                        Login | Signup
                      </button>
                      {/* {profileModalIsOpen && (
                        <GithubLoginOverlay closeModal={closeModals} />
                      )} */}
                    </>
                  )}
                  {challenge.projectName && (
                    <ChallengeSource
                      name={challenge.projectName}
                      url={challenge.url}
                      license={challenge.license}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center w-full"
        >
          {isPlaying && <Timer seconds={totalSeconds} />}
          <WarningContainer />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactElement;
  text: String;
}

export function ActionButton({
  text,
  icon,
  ...buttonProps
}: ActionButtonProps) {
  return (
    <button
      {...buttonProps}
      style={{
        fontFamily: "Fira Code",
      }}
      className="flex text-sm font-light text-dark-ocean items-center justify-between gap-2 rounded-3xl bg-gray-300 hover:bg-gray-400 hover:cursor-pointer px-3 py-0.5 my-1"
    >
      <div className="hidden sm:flex">{text}</div>
      {icon}
    </button>
  );
}

function ActionButtons() {
  const game = useGameStore((s) => s.game);
  const isMultiplayer = useIsMultiplayer();
  const isOwner = useIsOwner();
  const hasEndTime = useCodeStore((state) => state.endTime);
  const countdown = useGameStore((state) => state.countdown);
  const hasOpenModal = useHasOpenModal();
  const canManuallyStartGame =
    !hasOpenModal && isOwner && isMultiplayer && !hasEndTime && !countdown;
  const waitingForOwnerToStart =
    !isOwner && isMultiplayer && !hasEndTime && !countdown;
  const startGame = () => game?.start();
  useKeyMap(canManuallyStartGame, Keys.Enter, startGame);
  return (
    <div className="flex text-faded-gray gap-1">
      {isOwner && (
        <ActionButton
          text="refresh"
          title="Refresh the challenge"
          onClick={() => game?.next()}
          icon={
            <div className="h-3 w-3">
              <ReloadIcon />
            </div>
          }
        />
      )}
      <ActionButton
        text="invite"
        title="Invite your friends to play"
        icon={
          <div className="h-3 w-4">
            <LinkIcon />
          </div>
        }
        onClick={() => {
          const url = new URL(window.location.href);
          if (game?.id) {
            url.searchParams.set("id", game.id);
          }
          copyToClipboard(url.toString(), `${url} copied to clipboard`);
        }}
      />
      {/* {isOwner && <RaceSettings />} */}
      {canManuallyStartGame && (
        <ActionButton
          title="Start the game"
          text="start"
          onClick={startGame}
          icon={<PlayIcon />}
        />
      )}
      {waitingForOwnerToStart && (
        <span className="flex text-sm font-light text-off-white items-center justify-between">
          Waiting for race to start
        </span>
      )}
    </div>
  );
}

function Timer({ seconds }: { seconds: number }) {
  return (
    <div className="text-3xl ml-2 font-bold text-purple-300">
      {toHumanReadableTime(seconds)}
    </div>
  );
}
