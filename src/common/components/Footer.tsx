import { faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useIsPlaying } from "../hooks/useIsPlaying";

export function Footer() {
  const isPlaying = useIsPlaying();
  // const stargazersCount = stargazersCount();
  return (
    <footer
      className="h-10 tracking-tighter"
      style={{
        fontFamily: "Fira Code",
      }}
    >
      {!isPlaying && (
        <div className="w-full" style={{
          background: '#ffc55e'
        }}>
          <AnimatePresence>
            <motion.div
              className="flex items-center justify-center text-faded-gray"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="hidden sm:flex flex-grow items-center mb-2 text-xs">
                <h1 className="bg-dark-lake py-1 px-2 rounded font-bold text-faded-gray">
                  Tab
                </h1>
                <span className="mx-1 text-faded-gray">Refresh challenge</span>
                <h1 className="bg-dark-lake py-1 px-2 rounded font-bold ml-2 text-faded-gray">
                  Enter
                </h1>

                <span className="mx-1 text-faded-gray">Start race</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </footer>
  );
}
