"use client";

import Modal from '@/common/components/Modal';
import { Overlay } from '@/common/components/Overlay';
import { useIsPlaying } from '@/common/hooks/useIsPlaying';
import { useSocket } from '@/common/hooks/useSocket';
import UsernameDialog from '@/components/UsernameDialog';
import { Keys, useKeyMap } from '@/hooks/useKeyMap';
import { CodeArea } from '@/modules/play2/components/CodeArea'
import { PlayFooter } from '@/modules/play2/components/play-footer/PlayFooter';
import { PlayHeader } from '@/modules/play2/components/play-header/PlayHeader';
import { CodeTypingContainer } from '@/modules/play2/container/CodeTypingContainer';
import { ResultsContainer } from '@/modules/play2/container/ResultsContainer';
import { useChallenge } from '@/modules/play2/hooks/useChallenge';
import { useEndGame } from '@/modules/play2/hooks/useEndGame';
import { useGame } from '@/modules/play2/hooks/useGame';
import { useIsCompleted } from '@/modules/play2/hooks/useIsCompleted';
import { useResetStateOnUnmount } from '@/modules/play2/hooks/useResetStateOnUnmount';
import { useConnectionManager, useConnectionStore } from '@/modules/play2/state/connection-store';
import { closeModals, openEditNameModal, useHasOpenModal, useSettingsStore } from '@/modules/play2/state/settings-store';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { stat } from 'fs';
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import jpcsLogo from "../assets/icons/jpcs_logo.png";

function Play2Page() {

  const isCompleted = useIsCompleted();
  const isPlaying = useIsPlaying();
  useSocket();
  useConnectionManager();
  const game = useGame();
  const challenge = useChallenge();
  const { capsLockActive } = useKeyMap(
    true,
    Keys.Tab,
    useCallback(() => game?.next(), [game])
  );
  useResetStateOnUnmount();
  useEndGame();

  const editNameModalOpen = useSettingsStore((s) => s.editNameModalIsOpen);

  const [username, setUsername] = useState<string>('');

  const closeDialog = () => {
    useSettingsStore.setState((s) => ({
      ...s,
      editNameModalIsOpen: false,
    }));
  };

  const handleUsernameSubmit = (newUsername: string) => {
    game?.changeUsername(newUsername);
    closeDialog();
  };


  return (
    <div className="flex flex-col relative">
      <>


        <div>
          <UsernameDialog
            isOpen={editNameModalOpen}
            onRequestClose={closeDialog}
            onSubmit={handleUsernameSubmit}
          />

        </div>

        <img src={jpcsLogo.src} style={{
          maxWidth: '60%',
          alignSelf: 'center',
        }} />

        <span className="text-yellow-900 bold" style={{
          alignSelf: 'center',
          fontStyle: 'bold',
        }}>made with &lt;3 by @tyronscott_  ^__^</span>

        <PlayHeader spectator={true} />
        {capsLockActive && (
          <div className="absolute top-[-30px] z-10 flex w-full items-center justify-center gap-2 font-medium text-red-400">
            <div className="w-4 text-dark-ocean">
              <FontAwesomeIcon icon={faLock} className="text-red-400" />
            </div>
            Caps Lock is active
          </div>
        )}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {isCompleted && <ResultsContainer />}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {!isCompleted && (
              <CodeTypingContainer
                filePath={challenge.filePath}
                language={challenge.language}
              />
            )}
          </motion.div>
        </AnimatePresence>


        <PlayFooter challenge={challenge} />
      </>
      <ToastContainer />
    </div>
  );
}

export default Play2Page;