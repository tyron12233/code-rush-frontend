"use client";

import Modal from '@/common/components/Modal';
import { Overlay } from '@/common/components/Overlay';
import { useIsPlaying } from '@/common/hooks/useIsPlaying';
import { useSocket } from '@/common/hooks/useSocket';
import { Keys, useKeyMap } from '@/hooks/useKeyMap';
import { CodeArea } from '@/modules/play2/components/CodeArea'
import { PlayFooter } from '@/modules/play2/components/play-footer/PlayFooter';
import { PlayHeader } from '@/modules/play2/components/play-header/PlayHeader';
import { CodeTypingContainer } from '@/modules/play2/container/CodeTypingContainer';
import { ResultsContainer } from '@/modules/play2/container/ResultsContainer';
import { useChallenge } from '@/modules/play2/hooks/useChallenge';
import { useGame } from '@/modules/play2/hooks/useGame';
import { useIsCompleted } from '@/modules/play2/hooks/useIsCompleted';
import { useConnectionManager } from '@/modules/play2/state/connection-store';
import { closeModals, openEditNameModal, useHasOpenModal, useSettingsStore } from '@/modules/play2/state/settings-store';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import { stat } from 'fs';
import Image from 'next/image'
import { useCallback } from 'react';
import { ToastContainer } from 'react-toastify';

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
    useCallback(() => game?.next(), [ game])
  );

  return (
    <div className="flex flex-col relative">
      <>
        <PlayHeader />
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